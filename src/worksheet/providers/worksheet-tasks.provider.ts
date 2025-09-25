import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, In, MoreThanOrEqual, Repository } from 'typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';
import { PatchWorksheetsDto } from '../dto/patch-worksheets.dto';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
import { workSheetTableStatus } from '../enums/worksheet-table-status.enum';
import { Harvest } from '../entities/harvest.entity';
import { MonitoringCount } from '../entities/monitoring-count.entity';
import { Transit } from '../entities/transit.entity';

@Injectable()
export class WorksheetTasksProvider {
  private readonly logger = new Logger(WorksheetTasksProvider.name);
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRepository: Repository<Worksheet>,
    @InjectRepository(Transit)
    private readonly transitRepository: Repository<Transit>,
    private readonly datasource: DataSource,
    private readonly configService: ConfigService,
    // private readonly worksheetUpdateManyProvider: WorksheetUpdateManyProvider,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateWorksheetStatus() {
    // Get the current time
    const currentTime = new Date();

    try {
      // Logic 1: Update worksheets with IN_CULTURE status to READY_FOR_HARVEST
      const worksheetsInStocking = await this.worksheetRepository
        .createQueryBuilder('worksheet')
        .where('worksheet.status = :status', {
          status: worksheetStatus.IN_CULTURE,
        })
        .andWhere('worksheet.harvestTime < :currentTime', {
          currentTime,
        })
        .getMany();

      const updatedWorksheetsInStocking: PatchWorksheetDto[] = [];
      for (const worksheet of worksheetsInStocking) {
        updatedWorksheetsInStocking.push({
          id: worksheet.id,
          statusId: worksheetStatus.READY_FOR_HARVEST,
        });
      }

      await this.updateWorksheets({
        worksheets: updatedWorksheetsInStocking,
        updateAction: worksheetHistory.WORKSHEET_STATUS_UPDATED,
      });

      const worksheetIdsInStocking = worksheetsInStocking
        .map((worksheet) => worksheet.id)
        .toString();
      this.logger.log(
        `TASK SCHEDULER EXECUTED - ${worksheetsInStocking.length} worksheets status updated to READY_FOR_HARVEST - worksheet id's (${worksheetIdsInStocking})`,
      );

      // Logic 2: Update worksheets with WASHING status to EMPTY after 10 hours

      const washingHours = +this.configService.get('TANK_WASHING_TIME');
      const timeThreshold = new Date(
        currentTime.getTime() - washingHours * 60 * 60 * 1000,
      ); // 10 hours ago
      const worksheetsInWashing = await this.worksheetRepository
        .createQueryBuilder('worksheet')
        .where('worksheet.status = :status', {
          status: worksheetStatus.WASHING,
        })
        .andWhere('worksheet.harvestedAt < :timeThreshold', {
          timeThreshold,
        })
        .getMany();

      const updatedWorksheetsInWashing: PatchWorksheetDto[] = [];
      for (const worksheet of worksheetsInWashing) {
        updatedWorksheetsInWashing.push({
          id: worksheet.id,
          statusId: worksheetStatus.COMPLETE,
        });
      }

      await this.updateWorksheets({
        worksheets: updatedWorksheetsInWashing,
        updateAction: worksheetHistory.WORKSHEET_STATUS_UPDATED,
      });

      const worksheetIdsInWashing = worksheetsInWashing
        .map((worksheet) => worksheet.id)
        .toString();
      this.logger.log(
        `TASK SCHEDULER EXECUTED - ${worksheetsInWashing.length} worksheets status updated to EMPTY - worksheet id's (${worksheetIdsInWashing})`,
      );
    } catch (error) {
      this.logger.error('TASK SCHEDULER ERROR', error);
    }
  }

  // @Cron('0 6,18 * * *') // Executes at 6:00 AM and 6:00 PM every day
  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateActiveHarvestsToColdStorage() {
    this.logger.log(
      'TASK SCHEDULER STARTED - Updating active harvests to DONE',
    );

    const queryRunner = this.datasource.createQueryRunner();

    try {
      // Connect and start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const unitId = 1; // Unit ID to filter
      const statuses = [
        workSheetTableStatus.ACTIVE,
        workSheetTableStatus.PARTIALLY_TRANSIT,
      ];

      const currentTime = new Date();
      const twelveHoursAgo = new Date(
        currentTime.getTime() - 12 * 60 * 60 * 1000,
      ); // 12 hours ago

      // Fetch all active harvests
      const activeHarvests = await queryRunner.manager.find(Harvest, {
        where: {
          status: In(statuses),
          generatedAt: MoreThanOrEqual(twelveHoursAgo),
          unit: { id: unitId },
        },
        order: {
          generatedAt: 'ASC', // Sort by latest first
        },
      });

      if (!activeHarvests.length) {
        this.logger.log('No active harvests found to update.');
        await queryRunner.rollbackTransaction();
        return;
      }

      let millionsCount = 0;
      let frozenCupsCount = 0;

      const transitsInLast12Hours =
        await this.getTransitsCountGeneratedInLast12Hours();

      console.log('transitsInLast12Hours', transitsInLast12Hours);

      let countDown = 0;
      let continueTransfer = transitsInLast12Hours === 0;

      // Update harvests
      for (const harvest of activeHarvests) {
        console.log('Processing harvest ID:', harvest.id, harvest.count);
        if (
          countDown + harvest.count <= transitsInLast12Hours &&
          !continueTransfer
        ) {
          countDown += harvest.count;
          continue; // skip the harvests count that are already transited in the last 12 hours
        } else if (!continueTransfer) {
          if (countDown + harvest.count === transitsInLast12Hours) {
            continueTransfer = true;
          } else if (countDown + harvest.count > transitsInLast12Hours) {
            const requiredTransit = transitsInLast12Hours - countDown;
            const remainingCount = harvest.count - requiredTransit;
            if (requiredTransit > 0) {
              harvest.count = requiredTransit;
              harvest.countInStock = harvest.count;

              // save current harvest with the requiredTransit count
              await queryRunner.manager.save(harvest);
              // create a new harvest with the remaining count in frozen cups
              const newHarvest = queryRunner.manager.create(Harvest, {
                ...harvest,
                unit: { id: 2 }, // Change unit to Cold Storage (ID: 2)
                id: undefined, // Ensure a new record is created
                count: parseInt((remainingCount / 5).toString(), 10),
                countInStock: parseInt((remainingCount / 5).toString(), 10),
                status: workSheetTableStatus.ACTIVE,
                transferStatus: 'P', // Mark as partially transferred
              });
              await queryRunner.manager.save(newHarvest);

              millionsCount += remainingCount;
              frozenCupsCount += parseInt((remainingCount / 5).toString(), 10);
            }
            continueTransfer = true;
            continue;
          }
        }

        if (continueTransfer) {
          millionsCount += harvest.count;
          frozenCupsCount += parseInt((harvest.count / 5).toString(), 10);
          harvest.count = parseInt((harvest.count / 5).toString(), 10);
          harvest.countInStock = parseInt(
            (harvest.countInStock / 5).toString(),
            10,
          );
          harvest.unit.id = 2; // Change unit to Cold Storage (ID: 2)
          harvest.transferStatus = 'F'; // Mark as fully transferred

          // Save the updated harvest
          await queryRunner.manager.save(harvest);
        }
      }

      // update millionsHarvested or frozenCupsHarvested in monitoringCount table
      const monitoringCount = await queryRunner.manager.findOne(
        MonitoringCount,
        { where: { id: 1 } },
      );

      console.log('millionsCount', millionsCount);
      console.log('frozenCupsCount', frozenCupsCount);

      if (monitoringCount) {
        monitoringCount.millionsHarvested -= millionsCount;
        monitoringCount.frozenCupsHarvested += frozenCupsCount;
        await queryRunner.manager.save(MonitoringCount, monitoringCount);
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      const harvestIds = activeHarvests.map((harvest) => harvest.id).toString();
      this.logger.log(
        `TASK SCHEDULER EXECUTED - ${activeHarvests.length} harvests updated to DONE - harvest id's (${harvestIds})`,
      );
    } catch (error) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'TASK SCHEDULER ERROR - Failed to update active harvests to DONE',
        error,
      );
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async updateWorksheets(patchWorksheetsDto: PatchWorksheetsDto) {
    const updatedWorksheets: Worksheet[] = [];
    // create query runner instance
    const queryRunner = this.datasource.createQueryRunner();

    try {
      // connect query runner instance to datasource
      await queryRunner.connect();
      //start transaction
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException('Could not connect to the database.');
    }
    try {
      for (const worksheet of patchWorksheetsDto.worksheets) {
        const currentWorksheet = await queryRunner.manager.findOneBy(
          Worksheet,
          {
            id: worksheet.id,
          },
        );
        if (!currentWorksheet) {
          throw new ConflictException('Worksheet not found');
        }

        let status: Worksheet['status'] = currentWorksheet.status;
        if (worksheet.statusId) {
          status = {
            ...status,
            id: worksheet.statusId,
            value: 'Ready For Harvest',
          };
        }

        const updatedWorksheet = queryRunner.manager.create(Worksheet, {
          ...currentWorksheet,
          status,
        });
        const result = await queryRunner.manager.save(updatedWorksheet);
        updatedWorksheets.push(result);

        // update worksheet history

        let previousValue = '';
        let currentValue = '';
        switch (patchWorksheetsDto.updateAction) {
          case worksheetHistory.WORKSHEET_ASSIGNEE_UPDATED:
            previousValue = currentWorksheet.user?.userCode || '';
            currentValue = updatedWorksheet.user?.userCode || '';
            break;
          case worksheetHistory.WORKSHEET_STATUS_UPDATED:
            previousValue = currentWorksheet.status.value.toString();
            currentValue = updatedWorksheet.status.value.toString();
            break;
          default:
            break;
        }
        const newWorksheetHistory = queryRunner.manager.create(
          WorksheetHistory,
          {
            worksheet: { ...worksheet, restocks: [] },
            action: patchWorksheetsDto.updateAction,
            previousValue,
            currentValue,
          },
        );
        await queryRunner.manager.save(newWorksheetHistory);
      }

      // if sucessfull, commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessfull, rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      // release the connection
      await queryRunner.release();
    }
    return updatedWorksheets;
  }

  public async getTransitsCountGeneratedInLast12Hours(): Promise<number> {
    const currentTime = new Date();
    const twelveHoursAgo = new Date(
      currentTime.getTime() - 12 * 60 * 60 * 1000,
    ); // 12 hours ago

    const transits = await this.transitRepository.find({
      where: {
        generatedAt: MoreThanOrEqual(twelveHoursAgo), // Filter by generatedAt >= 12 hours ago
        unit: { id: 1 },
      },
      order: {
        generatedAt: 'ASC', // Sort by latest first
      },
    });

    return transits.reduce((sum, transit) => sum + (transit.count || 0), 0);
  }
}

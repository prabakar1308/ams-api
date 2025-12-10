import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Between,
  DataSource,
  In,
  IsNull,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

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
import { WorksheetUnit } from '../enums/worksheet-units.enum';
import { AutoConversion } from '../entities/auto-conversion.entity';

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

  // TOD: make it as manual trigger cron job for now
  // @Cron('0 6,18 * * *') // Executes at 6:00 AM and 6:00 PM every day
  public async updateActiveHarvestsToColdStorage() {
    this.logger.log(
      'TASK SCHEDULER STARTED - Updating active harvests to DONE',
    );

    const queryRunner = this.datasource.createQueryRunner();

    let result = '';

    try {
      // Connect and start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const unitId = WorksheetUnit.MILLIONS; // Unit ID to filter
      const statuses = [
        workSheetTableStatus.ACTIVE,
        workSheetTableStatus.PARTIALLY_TRANSIT,
      ];

      const currentTime = new Date();
      let previousTime = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      // get latest entry from auto conversion table
      const autoConversion = await queryRunner.manager
        .createQueryBuilder(AutoConversion, 'autoConversion')
        .orderBy('autoConversion.createdAt', 'DESC') // Order by createdAt in descending order
        .getOne();

      if (autoConversion) {
        result += `Last Auto Conversion At: ${autoConversion.createdAt.toDateString()}\n`;
        previousTime = autoConversion.createdAt;
      } else {
        result +=
          'No previous auto conversion found. executing for last 24 hours.\n';
      }

      // Fetch all active harvests
      const activeHarvests = await queryRunner.manager.find(Harvest, {
        where: {
          status: In(statuses),
          generatedAt: MoreThanOrEqual(previousTime),
          unit: { id: unitId },
        },
        order: {
          generatedAt: 'ASC', // Sort by latest first
        },
      });

      if (!activeHarvests.length) {
        this.logger.log('No active harvests found to update.');
        result += 'No active harvests found to update.\n';
        await queryRunner.rollbackTransaction();
        return result;
      }

      let millionsCount = 0;
      let frozenCupsCount = 0;

      const transitsInLastFewHours =
        await this.getTransitsCountGeneratedInLastHours(previousTime);

      let countDown = 0;
      let continueTransfer = transitsInLastFewHours === 0;

      // Update harvests
      for (const harvest of activeHarvests) {
        if (
          countDown + harvest.count <= transitsInLastFewHours &&
          !continueTransfer
        ) {
          countDown += harvest.count;
          continue; // skip the harvests count that are already transited in the last 12 hours
        } else if (!continueTransfer) {
          if (countDown + harvest.count === transitsInLastFewHours) {
            continueTransfer = true;
          } else if (countDown + harvest.count > transitsInLastFewHours) {
            const requiredTransit = transitsInLastFewHours - countDown;
            const remainingCount = harvest.count - requiredTransit;
            if (requiredTransit > 0) {
              harvest.count = requiredTransit;
              harvest.countInStock = harvest.count;

              // save current harvest with the requiredTransit count
              await queryRunner.manager.save(harvest);
              // create a new harvest with the remaining count in frozen cups
              const newHarvest = queryRunner.manager.create(Harvest, {
                ...harvest,
                transferId: harvest.id,
                unit: { id: 2 }, // Change unit to Cold Storage (ID: 2)
                id: undefined, // Ensure a new record is created
                count: parseInt((remainingCount / 5).toString(), 10),
                countInStock: parseInt((remainingCount / 5).toString(), 10),
                status: workSheetTableStatus.ACTIVE,
                transferStatus: 'P', // Mark as partially transferred
                // transferId: harvest.id,
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

      if (monitoringCount) {
        monitoringCount.millionsHarvested -= millionsCount;
        monitoringCount.frozenCupsHarvested += frozenCupsCount;
        await queryRunner.manager.save(MonitoringCount, monitoringCount);
      }

      // create entry in auto conversion table
      const newAutoConversion = queryRunner.manager.create(AutoConversion, {
        millions: millionsCount,
        frozenCups: frozenCupsCount,
        previousConversionAt: autoConversion
          ? autoConversion.createdAt
          : previousTime,
      });
      await queryRunner.manager.save(newAutoConversion);

      result += `Millions (-): ${millionsCount}, Frozen Cups (+): ${frozenCupsCount}\n`;

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

    return result;
  }

  public async revertLatestAutoConversion() {
    this.logger.log(
      'CONVERSION - Reversing active harvests from DONE to ACTIVE',
    );
    const queryRunner = this.datasource.createQueryRunner();
    try {
      // Connect and start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const autoConversionEntry = await queryRunner.manager.findOne(
        AutoConversion,
        {
          where: {
            id: Not(IsNull()),
          },
          order: { createdAt: 'DESC' },
        },
      );

      if (autoConversionEntry) {
        // get all harvests before the autoConversionEntry.createdAt date and after previousConversionAt date
        const harvests = await queryRunner.manager.find(Harvest, {
          where: {
            generatedAt: Between(
              autoConversionEntry.previousConversionAt,
              autoConversionEntry.createdAt,
            ),
          },
          order: { generatedAt: 'DESC' },
        });

        const convertedFrozenCups = harvests.filter((h) => h.transferStatus);

        let totalFrozenCups = 0;
        let totalMillions = 0;

        for (const harvest of convertedFrozenCups) {
          if (harvest.transferStatus === 'F') {
            totalFrozenCups += harvest.count;
            totalMillions += harvest.count * 5;
            // fully transferred, revert to millions
            harvest.count = harvest.count * 5;
            harvest.countInStock = harvest.count;
            harvest.unit.id = WorksheetUnit.MILLIONS;
            harvest.status = workSheetTableStatus.ACTIVE;
            harvest.transferStatus = '';
            await queryRunner.manager.save(harvest);
          } else if (harvest.transferStatus === 'P') {
            // partially transferred, need to create a merge harvest count based on transferId and delete the current one
            const originalHarvest = await queryRunner.manager.findOneBy(
              Harvest,
              {
                id: harvest.transferId,
              },
            );
            if (originalHarvest) {
              totalFrozenCups += harvest.count;
              totalMillions += harvest.count * 5;

              originalHarvest.count = originalHarvest.count + harvest.count * 5;
              originalHarvest.countInStock = originalHarvest.count;
              originalHarvest.unit.id = WorksheetUnit.MILLIONS;
              originalHarvest.status = workSheetTableStatus.ACTIVE;
              originalHarvest.transferStatus = '';
              await queryRunner.manager.save(originalHarvest);
              await queryRunner.manager.remove(harvest);
            }
          }
        }

        // remove the auto conversion entry
        await queryRunner.manager.remove(autoConversionEntry);

        //adjust monitoring count
        const monitoringCount = await queryRunner.manager.findOne(
          MonitoringCount,
          { where: { id: 1 } },
        );

        if (monitoringCount) {
          monitoringCount.millionsHarvested += totalMillions;
          monitoringCount.frozenCupsHarvested -= totalFrozenCups;
          await queryRunner.manager.save(MonitoringCount, monitoringCount);
        }

        // Commit the transaction
        await queryRunner.commitTransaction();
        // await queryRunner.rollbackTransaction();
        return `Latest auto conversion dated at ${autoConversionEntry.createdAt.toLocaleString()} reverted successfully`;
      }
    } catch (error) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'TASK SCHEDULER ERROR - Failed to reverse DONE harvests to ACTIVE',
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

  public async getTransitsCountGeneratedInLastHours(
    previousTime: Date,
  ): Promise<number> {
    const transits = await this.transitRepository.find({
      where: {
        generatedAt: MoreThanOrEqual(previousTime), // Filter by generatedAt >= 12 hours ago
        unit: { id: WorksheetUnit.MILLIONS },
      },
      order: {
        generatedAt: 'ASC', // Sort by latest first
      },
    });

    return transits.reduce((sum, transit) => sum + (transit.count || 0), 0);
  }
}

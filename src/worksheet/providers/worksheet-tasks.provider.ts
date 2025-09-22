import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Worksheet } from '../entities/worksheet.entity';
import { DataSource, In, Repository } from 'typeorm';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';
import { PatchWorksheetsDto } from '../dto/patch-worksheets.dto';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
import { workSheetTableStatus } from '../enums/worksheet-table-status.enum';
import { Harvest } from '../entities/harvest.entity';
import { ConfigService } from '@nestjs/config';
// import { WorksheetStatus } from 'src/master/entities/worksheet-status.entity';

@Injectable()
export class WorksheetTasksProvider {
  private readonly logger = new Logger(WorksheetTasksProvider.name);
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    private readonly datasource: DataSource,
    private readonly configService: ConfigService,
    // private readonly worksheetUpdateManyProvider: WorksheetUpdateManyProvider,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateWorksheetStatus() {
    // Get the current time
    const currentTime = new Date();

    try {
      // Logic 1: Update worksheets with IN_STOCKING status to READY_FOR_HARVEST
      const worksheetsInStocking = await this.worksheetRespository
        .createQueryBuilder('worksheet')
        .where('worksheet.status = :status', {
          status: worksheetStatus.IN_STOCKING,
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
      const worksheetsInWashing = await this.worksheetRespository
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
          statusId: worksheetStatus.OPEN,
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

  @Cron('0 6,18 * * *') // Executes at 6:00 AM and 6:00 PM every day
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

      // Fetch all active harvests
      const activeHarvests = await queryRunner.manager.find(Harvest, {
        where: {
          status: In(statuses),
          unit: { id: unitId },
        },
        relations: ['unit'], // Ensure the unit relation is loaded
      });

      if (!activeHarvests.length) {
        this.logger.log('No active harvests found to update.');
        await queryRunner.rollbackTransaction();
        return;
      }

      // Update harvests
      for (const harvest of activeHarvests) {
        harvest.count = parseInt((harvest.count / 5).toString(), 10);
        harvest.countInStock = parseInt(
          (harvest.countInStock / 5).toString(),
          10,
        );
        harvest.unit.id = 2; // Change unit to Cold Storage (ID: 2)
        harvest.status = workSheetTableStatus.COMPLETED; // Update status to DONE

        // Save the updated harvest
        await queryRunner.manager.save(harvest);
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
}

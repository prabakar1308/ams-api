import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Worksheet } from '../entities/worksheet.entity';
import { DataSource, Repository } from 'typeorm';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';
import { PatchWorksheetsDto } from '../dto/patch-worksheets.dto';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
// import { WorksheetStatus } from 'src/master/entities/worksheet-status.entity';

@Injectable()
export class WorksheetTasksProvider {
  private readonly logger = new Logger(WorksheetTasksProvider.name);
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    private readonly datasource: DataSource,
    // private readonly worksheetUpdateManyProvider: WorksheetUpdateManyProvider,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateWorksheetStatus() {
    // Get the current time
    const currentTime = new Date();

    try {
      // Filter worksheets with a In Culture status and harvestTime greater than the current time
      const worksheets = await this.worksheetRespository
        .createQueryBuilder('worksheet')
        .where('worksheet.status = :status', {
          status: worksheetStatus.IN_STOCKING,
        })
        .andWhere('worksheet.harvestTime < :currentTime', {
          currentTime,
        })
        .getMany();

      // Add logic to process the filtered worksheets
      const updatedWorksheets: PatchWorksheetDto[] = [];
      for (const worksheet of worksheets) {
        updatedWorksheets.push({
          id: worksheet.id,
          statusId: worksheetStatus.READY_FOR_HARVEST,
        });
      }
      await this.updateWorksheets({
        worksheets: updatedWorksheets,
        updateAction: worksheetHistory.WORKSHEET_STATUS_UPDATED,
      });
      const worksheetIds = worksheets
        .map((worksheet) => worksheet.id)
        .toString();
      this.logger.log(
        `TASK SCHEDULER EXECUTED -  ${worksheets.length} worksheets status updated - worksheet id's
         (${worksheetIds})`,
      );
    } catch (error) {
      this.logger.error('TASK SCHEDULER ERROR', error);
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

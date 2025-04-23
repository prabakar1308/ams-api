import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { PatchWorksheetsDto } from '../dto/patch-worksheets.dto';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';

@Injectable()
export class WorksheetUpdateManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  public async updateWorksheets(patchWorksheetsDto: PatchWorksheetsDto) {
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

        // Dependent columns check
        let user: Worksheet['user'] = currentWorksheet.user;
        if (worksheet.userId) {
          const currentUser =
            await this.worksheetDependentsProvider.getWorksheetUser(worksheet);
          if (!currentUser) {
            throw new ConflictException('Assigned User not found');
          }
          user = currentUser;
        }
        let status: Worksheet['status'] = currentWorksheet.status;
        if (worksheet.statusId) {
          const currentStatus =
            await this.worksheetDependentsProvider.getWorksheetStatus(
              worksheet,
            );
          if (!currentStatus) {
            throw new ConflictException('Worksheet Status not found');
          }
          status = currentStatus;
        }

        // currentWorksheet = {
        //   ...currentWorksheet,
        //   user,
        //   status,
        // };
        const updatedWorksheet = queryRunner.manager.create(Worksheet, {
          ...currentWorksheet,
          user,
          status,
        });
        const result = await queryRunner.manager.save(updatedWorksheet);
        updatedWorksheets.push(result);

        // update worksheet history

        let previousValue = '';
        let currentValue = '';
        switch (patchWorksheetsDto.updateAction) {
          case worksheetHistory.WORKSHEET_ASSIGNEE_UPDATED:
            previousValue = currentWorksheet.user?.userId || '';
            currentValue = updatedWorksheet.user?.userId || '';
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
            worksheet: worksheet,
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
      console.log(error);
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

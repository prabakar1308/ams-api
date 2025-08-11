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
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';

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

        let generatedAt: Date = currentWorksheet.generatedAt;
        if (worksheet.generatedAt) {
          generatedAt = new Date(worksheet.generatedAt);
        }
        let status: Worksheet['status'] = currentWorksheet.status;
        let harvestProps = {};
        if (worksheet.statusId) {
          const currentStatus =
            await this.worksheetDependentsProvider.getWorksheetStatus(
              worksheet,
            );
          if (!currentStatus) {
            throw new ConflictException('Worksheet Status not found');
          }
          status = currentStatus;

          // update harvest time when movng from ready for stocking to In Culture
          if (
            Number(currentWorksheet.status.id) ===
              Number(worksheetStatus.READY_FOR_STOCKING) &&
            Number(worksheet.statusId) === Number(worksheetStatus.IN_STOCKING)
          ) {
            const generatedDate = generatedAt
              ? new Date(generatedAt)
              : new Date();
            const harvestTime = new Date(
              generatedDate.setHours(
                generatedDate.getHours() + currentWorksheet.harvestHours,
              ),
            );
            harvestProps = {
              harvestTime: new Date(harvestTime),
            };
          }
        }

        // let restocks: Restock[] = [];
        // if (worksheet.restocks && worksheet.restocks.length) {
        //   restocks =
        //     await this.worksheetDependentsProvider.findMultipleRestocks(
        //       worksheet.restocks,
        //     );
        // }

        const updatedWorksheet = queryRunner.manager.create(Worksheet, {
          ...currentWorksheet,
          user,
          status,
          generatedAt,
          ...harvestProps,
          // restocks,
        });
        const result = await queryRunner.manager.save(updatedWorksheet);
        updatedWorksheets.push(result);

        // update worksheet history

        const values: { previousValue: string; currentValue: string }[] = [];
        switch (patchWorksheetsDto.updateAction) {
          case worksheetHistory.WORKSHEET_ASSIGNEE_UPDATED:
            values.push({
              previousValue: currentWorksheet.user?.userCode || '',
              currentValue: updatedWorksheet.user?.userCode || '',
            });
            break;
          case worksheetHistory.WORKSHEET_STATUS_UPDATED:
            values.push({
              previousValue: currentWorksheet.status.value.toString(),
              currentValue: updatedWorksheet.status.value.toString(),
            });
            break;
          case worksheetHistory.WORKSHEET_STATUS_ASSIGNEE_UPDATED:
            if (worksheet.userId) {
              values.push({
                previousValue: currentWorksheet.user?.userCode || '',
                currentValue: updatedWorksheet.user?.userCode || '',
              });
            }
            if (worksheet.statusId) {
              values.push({
                previousValue: currentWorksheet.status.value.toString(),
                currentValue: updatedWorksheet.status.value.toString(),
              });
            }
            break;
          default:
            break;
        }
        for (const value of values) {
          const { previousValue, currentValue } = value;
          const newWorksheetHistory = queryRunner.manager.create(
            WorksheetHistory,
            {
              worksheet: updatedWorksheet,
              action: patchWorksheetsDto.updateAction,
              previousValue,
              currentValue,
            },
          );
          await queryRunner.manager.save(newWorksheetHistory);
        }
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

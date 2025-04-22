import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Worksheet } from '../entities/worksheet.entity';
import { DataSource } from 'typeorm';
import { CreateWorksheetsDto } from '../dto/create-worksheets.dto';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';

@Injectable()
export class WorksheetCreateManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  public async createWorksheets(createWorksheetsDto: CreateWorksheetsDto) {
    const newWorksheets: Worksheet[] = [];
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
      for (const worksheet of createWorksheetsDto.worksheets) {
        // Dependent columns check
        const currentUser =
          await this.worksheetDependentsProvider.getWorksheetUser(worksheet);
        const status =
          await this.worksheetDependentsProvider.getWorksheetStatus(worksheet);
        const tankType =
          await this.worksheetDependentsProvider.getWorksheetTankType(
            worksheet,
          );
        const harvestType =
          await this.worksheetDependentsProvider.getWorksheetHarvestType(
            worksheet,
          );
        const newWorksheet = queryRunner.manager.create(Worksheet, {
          ...worksheet,
          status: status || undefined,
          tankType: tankType || undefined,
          user: currentUser || undefined,
          harvestType: harvestType || undefined,
        });
        const result = await queryRunner.manager.save(newWorksheet);
        newWorksheets.push(result);

        // update worksheet history
        const newWorksheetHistory = queryRunner.manager.create(
          WorksheetHistory,
          {
            worksheet: result,
            action: worksheetHistory.WORKSHEET_CREATED,
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
    return newWorksheets;
  }
}

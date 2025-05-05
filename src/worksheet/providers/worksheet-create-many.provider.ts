import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Worksheet } from '../entities/worksheet.entity';
import { DataSource } from 'typeorm';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';
import { CreateWorksheetDto } from '../dto/create-worksheet.dto';

@Injectable()
export class WorksheetCreateManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  public async createWorksheets(createWorksheetDto: CreateWorksheetDto) {
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
      // Dependent columns check
      const currentUser =
        await this.worksheetDependentsProvider.getWorksheetUser(
          createWorksheetDto,
        );
      const status =
        await this.worksheetDependentsProvider.getWorksheetStatus(
          createWorksheetDto,
        );
      const tankType =
        await this.worksheetDependentsProvider.getWorksheetTankType(
          createWorksheetDto,
        );
      const harvestType =
        await this.worksheetDependentsProvider.getWorksheetHarvestType(
          createWorksheetDto,
        );
      const inputUnit =
        await this.worksheetDependentsProvider.getWorksheetInputUnit(
          createWorksheetDto,
        );

      for (const tankNumber of createWorksheetDto.tanks) {
        const newWorksheet = queryRunner.manager.create(Worksheet, {
          ...createWorksheetDto,
          tankNumber,
          status: status || undefined,
          tankType: tankType || undefined,
          user: currentUser || undefined,
          harvestType: harvestType || undefined,
          inputUnit: inputUnit || undefined,
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

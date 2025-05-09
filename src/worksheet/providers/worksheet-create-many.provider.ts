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
import { ConfigService } from '@nestjs/config';
import { Restock } from '../entities/restock.entity';

@Injectable()
export class WorksheetCreateManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
    private readonly configService: ConfigService,
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

      let restocks: Restock[] = [];
      if (createWorksheetDto.restocks && createWorksheetDto.restocks.length) {
        restocks = await this.worksheetDependentsProvider.findMultipleRestocks(
          createWorksheetDto.restocks,
        );
      }

      for (const tankNumber of createWorksheetDto.tanks) {
        // check active worksheet exists for tank no.
        const worksheetCompletedStatusId = +this.configService.get(
          'WORKSHEET_COMPLETED_STATUS',
        );
        const worksheets = tankType
          ? await queryRunner.manager
              .createQueryBuilder(Worksheet, 'worksheet')
              .where('worksheet.tankNumber = :tankNumber', {
                tankNumber,
              })
              .andWhere('worksheet.tankTypeId = :tankTypeId', {
                tankTypeId: tankType.id,
              })
              .andWhere('worksheet.statusId NOT IN (:...statusIds)', {
                statusIds: [worksheetCompletedStatusId], // Add more IDs if needed
              })
              .getMany()
          : [];

        if (worksheets && worksheets.length) {
          throw new ConflictException(
            `Active Worksheet is still exists for ${tankNumber}`,
          );
        }

        const newWorksheet = queryRunner.manager.create(Worksheet, {
          ...createWorksheetDto,
          tankNumber,
          status: status || undefined,
          tankType: tankType || undefined,
          user: currentUser || undefined,
          harvestType: harvestType || undefined,
          inputUnit: inputUnit || undefined,
          restocks,
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
      throw new ConflictException(String(error), {
        description: String(error),
      });
    } finally {
      // release the connection
      await queryRunner.release();
    }
    return newWorksheets;
  }
}

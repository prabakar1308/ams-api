import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CreateTransitDto } from 'src/worksheet/dto/create-transit.dto';
import { Transit } from 'src/worksheet/entities/transit.entity';
import { UsersService } from 'src/users/providers/users.service';
import { WorksheetUnitService } from 'src/master/providers/worksheet-unit.service';
import { workSheetTableStatus } from 'src/worksheet/enums/worksheet-table-status.enum';

import { Worksheet } from '../../entities/worksheet.entity';
import { Harvest } from '../../entities/harvest.entity';
import { Restock } from '../../entities/restock.entity';
import { CreateHarvestsDto } from '../../dto/create-harvests.dto';
import { CreateRestockDto } from '../../dto/create-restock.dto';
import { PatchWorksheetDto } from '../../dto/patch-worksheet.dto';
import { WorksheetUpdateManyProvider } from '../worksheet-update-many.provider';
import { worksheetHistory } from '../../enums/worksheet-history-actions.enum';
import { RestockService } from '../restock/restock.service';

@Injectable()
export class WorksheetHarvestManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
    private readonly worksheetUpdateManyProvider: WorksheetUpdateManyProvider,
    @Inject(forwardRef(() => RestockService))
    private readonly restockService: RestockService,
    private readonly userService: UsersService,
    private readonly unitService: WorksheetUnitService,
  ) {}

  public async createWorksheetHarvests(createHarvests: CreateHarvestsDto) {
    const worksheets: PatchWorksheetDto[] = [];
    const results: Array<{ harvest?: Harvest; restock?: Restock }> = [];
    let worksheetResponse: Worksheet[] = [];
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
      for (const harvest of createHarvests.harvests) {
        let response = {};
        let status = workSheetTableStatus.ACTIVE;

        if (harvest?.countInStock === 0) {
          status = workSheetTableStatus.COMPLETED;
        } else if (
          (harvest?.countInStock ?? 0) > 0 &&
          harvest?.countInStock !== harvest.count
        ) {
          status = workSheetTableStatus.PARTIALLY_TRANSIT;
        }

        const measuredBy = await this.userService.findOneById(
          harvest.measuredBy,
        );

        const unit = await this.unitService.getWorksheetUnitById(
          harvest.unitId,
        );

        const newHarvest = queryRunner.manager.create(Harvest, {
          ...harvest,
          measuredBy: measuredBy || undefined,
          unit: unit || undefined,
          status,
        });
        const harvestResponse = await queryRunner.manager.save(newHarvest);
        response = { ...response, harvest: harvestResponse };

        if (harvest.restockCount > 0) {
          const restock = new CreateRestockDto();
          restock.worksheetId = newHarvest.worksheetId;
          restock.harvestId = harvestResponse.id;
          restock.count = harvest.restockCount;
          restock.unitId = harvest.restockUnitId;
          restock.status = workSheetTableStatus.ACTIVE;

          const unit = await this.restockService.getRestockUnit(restock);
          const worksheet =
            await this.restockService.getRestockWorksheet(restock);

          const newRestock = queryRunner.manager.create(Restock, {
            ...restock,
            unit: unit || undefined,
            worksheet: worksheet || undefined,
          });
          const restockResponse = await queryRunner.manager.save(newRestock);
          response = { ...response, restock: restockResponse };
        }

        // add transit if exists
        if ((harvest.transitCount ?? 0) > 0) {
          const transit = new CreateTransitDto();
          transit.harvestId = harvestResponse.id;
          transit.count = harvest.transitCount || 0;
          transit.unitId = harvest.unitId;
          transit.unitSectorId = harvest.unitSectorId || 0;

          const newTransit = queryRunner.manager.create(Transit, transit);
          const transitResponse = await queryRunner.manager.save(newTransit);
          response = { ...response, transit: transitResponse };
        }

        worksheets.push({
          id: harvest.worksheetId,
          statusId: harvest.statusId,
        });

        results.push(response);
      }

      worksheetResponse =
        await this.worksheetUpdateManyProvider.updateWorksheets({
          worksheets,
          updateAction: worksheetHistory.WORKSHEET_STATUS_UPDATED,
        });

      // if sucessfull, commit
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(String(error));
      // if unsuccessfull, rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      // release the connection
      await queryRunner.release();
    }
    return { results, worksheetResponse };
  }
}

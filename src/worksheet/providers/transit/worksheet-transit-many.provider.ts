import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Harvest } from '../../entities/harvest.entity';
import { Transit } from '../../entities/transit.entity';
import { CreateTransitsDto } from '../../dto/create-transits.dto';
// import { PatchHarvestDto } from '../../dto/patch-harvest.dto';
// import { workSheetTableStatus } from '../../enums/worksheet-table-status.enum';
import { WorksheetUnitService } from 'src/master/providers/worksheet-unit.service';
import { UnitSectorService } from 'src/master/providers/unit-sector.service';
import { WorksheetUnit } from 'src/worksheet/enums/worksheet-units.enum';
import { MonitoringCount } from 'src/worksheet/entities/monitoring-count.entity';

@Injectable()
export class WorksheetTransitManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
    private unitService: WorksheetUnitService,
    private readonly unitSectorService: UnitSectorService,
  ) {}

  public async createMultipleTransits(createTransits: CreateTransitsDto) {
    // const results: Array<{ transit?: Transit; updatedHarvest?: Harvest }> = [];
    const results: { transit: Transit[]; updatedHarvest?: Harvest } = {
      transit: [],
    };
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
      let transitCount = 0;
      let unitId = WorksheetUnit.MILLIONS;

      // const harvest = await queryRunner.manager.findOneBy(Harvest, {
      //   id: createTransits.harvestId,
      // });

      // if (!harvest) {
      //   throw new Error('Harvest not found');
      // }

      for (const transit of createTransits.transits) {
        const unit = await this.unitService.getWorksheetUnitById(
          transit.unitId,
        );

        const unitSector = await this.unitSectorService.getUnitSectorById(
          transit.unitSectorId,
        );

        const newTransit = queryRunner.manager.create(Transit, {
          ...transit,
          unit: unit || undefined,
          // harvest,
          unitSector: unitSector || undefined,
          generatedAt: createTransits.generatedAt || new Date(),
        });
        const transitResponse = await queryRunner.manager.save(newTransit);
        transitCount += transit.count;
        unitId = transit.unitId;

        // Ensure the response matches the Transit type
        results.transit.push(transitResponse);
      }

      // update harvest status
      // const patchHarvest = new PatchHarvestDto();
      // patchHarvest.id = harvest.id;
      // if (harvest?.countInStock === transitCount) {
      //   patchHarvest.countInStock = 0;
      //   patchHarvest.status = workSheetTableStatus.COMPLETED;
      // } else if ((harvest?.countInStock ?? 0) > transitCount) {
      //   patchHarvest.countInStock = (harvest?.countInStock ?? 0) - transitCount;
      //   patchHarvest.status = workSheetTableStatus.PARTIALLY_TRANSIT;
      // }

      // const updatedHarvest = queryRunner.manager.create(Harvest, {
      //   ...patchHarvest,
      //   measuredBy: harvest.measuredBy,
      //   unit: harvest.unit,
      // });
      // const updatedHarvestResponse =
      //   await queryRunner.manager.save(updatedHarvest);

      // results.updatedHarvest = updatedHarvestResponse;

      // update millionsHarvested or frozenCupsHarvested in monitoringCount table
      const monitoringCount = await queryRunner.manager.findOne(
        MonitoringCount,
        { where: { id: 1 } },
      );

      if (monitoringCount) {
        if (unitId === WorksheetUnit.MILLIONS) {
          monitoringCount.millionsTransited += transitCount;
        } else if (unitId === WorksheetUnit.FROZEN_CUPS) {
          monitoringCount.frozenCupsTransited += transitCount;
        }
        await queryRunner.manager.save(MonitoringCount, monitoringCount);
      }

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
    return results;
  }
}

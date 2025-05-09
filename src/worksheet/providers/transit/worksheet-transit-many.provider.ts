import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Harvest } from '../../entities/harvest.entity';
import { CreateTransitsDto } from '../../dto/create-transits.dto';
import { Transit } from '../../entities/transit.entity';
import { PatchHarvestDto } from '../../dto/patch-harvest.dto';
import { workSheetTableStatus } from '../../enums/worksheet-table-status.enum';

@Injectable()
export class WorksheetTransitManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
  ) {}

  public async createMultipleTransits(createTransits: CreateTransitsDto) {
    const results: Array<{ transit?: Transit; updatedHarvest?: Harvest }> = [];
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
      for (const transit of createTransits.transits) {
        let response = {};

        const newTransit = queryRunner.manager.create(Transit, transit);
        const transitResponse = await queryRunner.manager.save(newTransit);
        response = { ...response, transit: transitResponse };

        const harvest = await queryRunner.manager.findOneBy(Harvest, {
          id: transit.harvestId,
        });

        if (!harvest) {
          throw new Error('Harvest not found');
        }

        const patchHarvest = new PatchHarvestDto();
        patchHarvest.id = harvest.id;
        if (harvest?.countInStock === transit.count) {
          patchHarvest.countInStock = 0;
          patchHarvest.status = workSheetTableStatus.COMPLETED;
        } else if ((harvest?.countInStock ?? 0) > transit.count) {
          patchHarvest.countInStock =
            (harvest?.countInStock ?? 0) - transit.count;
          patchHarvest.status = workSheetTableStatus.PARTIALLY_TRANSIT;
        }
        const updatedHarvest = queryRunner.manager.create(
          Harvest,
          patchHarvest,
        );
        const updatedHarvestResponse =
          await queryRunner.manager.save(updatedHarvest);
        response = { ...response, updatedHarvest: updatedHarvestResponse };

        results.push(response);
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

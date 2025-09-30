import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transit } from 'src/worksheet/entities/transit.entity';
import { PatchTransitDto } from 'src/worksheet/dto/patch-transit.dto';
import { MonitoringCount } from 'src/worksheet/entities/monitoring-count.entity';
import { WorksheetUnit } from 'src/worksheet/enums/worksheet-units.enum';
// import { Harvest } from 'src/worksheet/entities/harvest.entity';
// import { workSheetTableStatus } from 'src/worksheet/enums/worksheet-table-status.enum';

@Injectable()
export class TransitUpdateProvider {
  constructor(private readonly datasource: DataSource) {}

  public async updateTransit(
    updateData: PatchTransitDto,
  ): Promise<Transit | null> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let transitCount = 0;
      const transit = await queryRunner.manager.findOne(Transit, {
        where: { id: updateData.id },
      });

      // const harvest = await queryRunner.manager.findOne(Harvest, {
      //   where: { id: updateData.harvestId },
      // });

      if (!transit) {
        throw new ConflictException('Transit not found');
      }
      const unitId: WorksheetUnit =
        (transit.unit.id as WorksheetUnit) || WorksheetUnit.MILLIONS;

      // const { countInStock, harvestId } = updateData;

      // If countInStock and harvestId are provided, update countInStock & status in Harvest table
      // if (countInStock !== undefined && harvestId) {
      //   let status = harvest?.status;
      //   const harvestCount = harvest?.count || 0;
      //   if (countInStock === harvestCount) status = workSheetTableStatus.ACTIVE;
      //   else if (countInStock < harvestCount)
      //     status = workSheetTableStatus.PARTIALLY_TRANSIT;
      //   await queryRunner.manager
      //     .createQueryBuilder()
      //     .update('Harvest')
      //     .set({ countInStock, status })
      //     .where('id = :harvestId', { harvestId })
      //     .execute();
      // }

      let updatedTransit: Transit;
      if (updateData.isDelete) {
        transitCount = -transit.count || 0;
        await queryRunner.manager.delete(Transit, transit.id);
        updatedTransit = transit;
      } else {
        transitCount = (updateData.count || 0) - (transit.count || 0);
        // Update fields from updateData
        Object.assign(transit, updateData);
        updatedTransit = await queryRunner.manager.save(transit);
      }

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

      await queryRunner.commitTransaction();
      return updatedTransit;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not update transit', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }
  }
}

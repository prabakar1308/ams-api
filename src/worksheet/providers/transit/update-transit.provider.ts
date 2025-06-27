import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transit } from 'src/worksheet/entities/transit.entity';
import { PatchTransitDto } from 'src/worksheet/dto/patch-transit.dto';
import { Harvest } from 'src/worksheet/entities/harvest.entity';
import { workSheetTableStatus } from 'src/worksheet/enums/worksheet-table-status.enum';

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
      const transit = await queryRunner.manager.findOne(Transit, {
        where: { id: updateData.id },
      });

      const harvest = await queryRunner.manager.findOne(Harvest, {
        where: { id: updateData.harvestId },
      });

      if (!transit) {
        throw new ConflictException('Transit not found');
      }

      const { countInStock, harvestId } = updateData;

      // If countInStock and harvestId are provided, update countInStock & status in Harvest table
      if (countInStock !== undefined && harvestId) {
        let status = harvest?.status;
        const harvestCount = harvest?.count || 0;
        if (countInStock === harvestCount) status = workSheetTableStatus.ACTIVE;
        else if (countInStock < harvestCount)
          status = workSheetTableStatus.PARTIALLY_TRANSIT;
        await queryRunner.manager
          .createQueryBuilder()
          .update('Harvest')
          .set({ countInStock, status })
          .where('id = :harvestId', { harvestId })
          .execute();
      }

      let updatedTransit: Transit;
      if (updateData.isDelete) {
        await queryRunner.manager.delete(Transit, transit.id);
        updatedTransit = transit;
      } else {
        // Update fields from updateData
        Object.assign(transit, updateData);
        updatedTransit = await queryRunner.manager.save(transit);
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

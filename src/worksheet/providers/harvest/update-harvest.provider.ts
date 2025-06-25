import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Harvest } from '../../entities/harvest.entity';
import { PatchHarvestDto } from '../../dto/patch-harvest.dto';
import { workSheetTableStatus } from '../../enums/worksheet-table-status.enum';
import { UsersService } from 'src/users/providers/users.service';
import { WorksheetUnitService } from 'src/master/providers/worksheet-unit.service';
import { WorksheetUnit } from 'src/worksheet/enums/worksheet-units.enum';
import { RestockService } from '../restock/restock.service';

@Injectable()
export class HarvestUpdateProvider {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    private readonly userService: UsersService,
    private readonly unitService: WorksheetUnitService,
    private readonly restockService: RestockService,
  ) {}

  public async updateHarvest(
    patchHarvestDto: PatchHarvestDto,
  ): Promise<Harvest> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const harvest = await queryRunner.manager.findOne(Harvest, {
        where: { id: patchHarvestDto.id },
      });

      if (!harvest) {
        throw new ConflictException('Harvest not found');
      }

      if (patchHarvestDto.restockCount !== undefined) {
        const restockRepo =
          this.harvestRepository.manager.getRepository('Restock');

        if (patchHarvestDto.restockCount > 0) {
          // Check if an ACTIVE restock exists for this harvest
          const existingRestock = await restockRepo.findOne({
            where: {
              harvest: { id: harvest.id },
              status: workSheetTableStatus.ACTIVE,
            },
          });

          if (existingRestock) {
            // Update the restock count for ACTIVE restocks related to this harvest
            await restockRepo
              .createQueryBuilder()
              .update()
              .set({ count: patchHarvestDto.restockCount })
              .where('harvestId = :harvestId', { harvestId: harvest.id })
              .andWhere('status = :status', {
                status: workSheetTableStatus.ACTIVE,
              })
              .execute();
          } else {
            // Create a new ACTIVE restock entry for this harvest
            const unitId = WorksheetUnit.MILLIONS;
            const unit = await this.restockService.getRestockUnit(unitId);
            const worksheet = await this.restockService.getRestockWorksheet(
              harvest.worksheet.id,
            );
            console.log(worksheet);
            await restockRepo.save({
              harvest: harvest,
              unitId: WorksheetUnit.MILLIONS,
              worksheetId: harvest.worksheet?.id || 0,
              count: patchHarvestDto.restockCount,
              status: workSheetTableStatus.ACTIVE,
              unit: unit || undefined,
              worksheet: worksheet || undefined,
            });
          }
        } else if (patchHarvestDto.restockCount === 0) {
          // Delete ACTIVE restocks related to this harvest
          await restockRepo
            .createQueryBuilder()
            .delete()
            .where('harvestId = :harvestId', { harvestId: harvest.id })
            .andWhere('status = :status', {
              status: workSheetTableStatus.ACTIVE,
            })
            .execute();
        }
      }

      // Update fields
      if (patchHarvestDto.count !== undefined) {
        harvest.count = patchHarvestDto.count;
      }
      if (patchHarvestDto.countInStock !== undefined) {
        harvest.countInStock = patchHarvestDto.countInStock;
      }
      if (patchHarvestDto.measuredBy !== undefined) {
        const measuredBy = await this.userService.findOneById(
          patchHarvestDto.measuredBy,
        );
        harvest.measuredBy = measuredBy || harvest.measuredBy;
      }

      if (patchHarvestDto.unitId !== undefined) {
        const unit = await this.unitService.getWorksheetUnitById(
          patchHarvestDto.unitId,
        );
        harvest.unit = unit || harvest.unit;
      }

      const updatedHarvest = await queryRunner.manager.save(harvest);
      await queryRunner.commitTransaction();
      return updatedHarvest;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not update harvest', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import {
  Between,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
} from 'typeorm';
import { Transit } from 'src/worksheet/entities/transit.entity';
import { PatchTransitDto } from 'src/worksheet/dto/patch-transit.dto';
import { MonitoringCount } from 'src/worksheet/entities/monitoring-count.entity';
import { WorksheetUnit } from 'src/worksheet/enums/worksheet-units.enum';
import { AutoConversion } from 'src/worksheet/entities/auto-conversion.entity';
import { Harvest } from 'src/worksheet/entities/harvest.entity';
import { UnitSectorService } from 'src/master/providers/unit-sector.service';
import { workSheetTableStatus } from 'src/worksheet/enums/worksheet-table-status.enum';
// import { Harvest } from 'src/worksheet/entities/harvest.entity';
// import { workSheetTableStatus } from 'src/worksheet/enums/worksheet-table-status.enum';

@Injectable()
export class TransitUpdateProvider {
  constructor(
    private readonly datasource: DataSource,
    private readonly unitSectorService: UnitSectorService,
  ) {}

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
        const unitSector = await this.unitSectorService.getUnitSectorById(
          updateData.unitSectorId || 0,
        );
        updatedTransit = await queryRunner.manager.save(Transit, {
          ...transit,
          unitSector: unitSector || transit.unitSector,
        });
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

      // adjust harvest count if needed
      // if (unitId === WorksheetUnit.MILLIONS && transitCount !== 0) {
      //   // await this.adjustHarvestCount(
      //   //   queryRunner,
      //   await this.adjustHarvestCount(
      //     queryRunner,
      //     transitCount,
      //     updatedTransit.generatedAt,
      //   );
      // }

      await queryRunner.commitTransaction();
      // await queryRunner.rollbackTransaction();
      // await queryRunner.release();
      return updatedTransit;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        error ? String(error) : 'Could not update transit',
        {
          description: String(error),
        },
      );
    } finally {
      await queryRunner.release();
    }
  }

  // TODO: Not used currently, need to revisit the logic when needed
  public async adjustHarvestCount(
    queryRunner: QueryRunner,
    transitCount: number,
    generatedDate: Date,
  ): Promise<void> {
    // Implementation for adjusting harvest count goes here

    // find an entry from auto conversion table with generatedDate > previousConversionDate and <= createdAt
    // if found, update the harvest count accordingly

    // const istDate = new Date(generatedDate.getTime() + 5.5 * 60 * 60 * 1000);
    // console.log('generatedDate', generatedDate, istDate);
    const autoConversionEntry = await queryRunner.manager.findOne(
      AutoConversion,
      {
        where: {
          createdAt: MoreThanOrEqual(generatedDate),
          previousConversionAt: LessThanOrEqual(generatedDate),
        },
        order: { createdAt: 'DESC' },
      },
    );

    console.log(
      'autoConversionEntry',
      autoConversionEntry,
      new Date(generatedDate),
    );

    if (autoConversionEntry) {
      // get all harvests before the autoConversionEntry.createdAt date and after previousConversionAt date
      const harvests = await queryRunner.manager.find(Harvest, {
        where: {
          generatedAt: Between(
            autoConversionEntry.previousConversionAt,
            autoConversionEntry.createdAt,
          ),
        },
        order: { generatedAt: 'DESC' },
      });
      // scenario 1 - if transitCount is negative, increase the harvest count and decrease the converted count
      // get all harvests before the autoConversionEntry.createdAt date and after previousConversionAt date
      // and increase the harvest count by transitCount (which is negative) and decrease the converted count by transitCount
      if (transitCount > 0) {
        const convertedFrozenCups = harvests
          .filter((h) => h.transferStatus)
          .sort((a, b) => a.generatedAt.getTime() - b.generatedAt.getTime());
        if (convertedFrozenCups && convertedFrozenCups.length) {
          // remove from the latest converted harvest first
          let remainingCount = Math.abs(transitCount) / 5 || 0;
          for (const harvest of convertedFrozenCups) {
            console.log('remainingCount', remainingCount);
            if (remainingCount <= 0) break;
            const availableCount = harvest.count || 0;
            const decreaseBy =
              availableCount >= remainingCount
                ? remainingCount
                : availableCount;
            harvest.count -= decreaseBy;
            harvest.countInStock -= decreaseBy;
            remainingCount -= decreaseBy;
            console.log('harvest.count', harvest.count, decreaseBy);
            if (harvest.count === 0) {
              await queryRunner.manager.save(Harvest, {
                ...harvest,
                unit: { id: 1 }, // Change unit to Millions (ID: 1)
                count: parseInt((harvest.count * 5).toString(), 10),
                countInStock: parseInt((harvest.count * 5).toString(), 10),
                transferId: 0,
                transferStatus: '',
              });
            } else {
              // update the count in parent entry as well
              const parentHarvest = await queryRunner.manager.findOne(Harvest, {
                where: { id: harvest.transferId },
              });
              console.log(
                harvest.transferId,
                harvest.transferStatus,
                harvest.id,
              );
              if (parentHarvest && harvest.transferId) {
                parentHarvest.count += decreaseBy * 5;
                parentHarvest.countInStock += decreaseBy * 5;
                console.log('parentHarvest', parentHarvest.count);
                await queryRunner.manager.save(Harvest, parentHarvest);
              } else {
                // switch to miilions directly for decreaseBy count and add new entry for frozen cups with partial status
                await queryRunner.manager.save(Harvest, {
                  ...harvest,
                  unit: { id: 1 }, // Change unit to Millions (ID: 1)
                  count: parseInt((decreaseBy * 5).toString(), 10),
                  countInStock: parseInt((decreaseBy * 5).toString(), 10),
                  transferId: 0,
                  transferStatus: '',
                });

                const newHarvest = queryRunner.manager.create(Harvest, {
                  ...harvest,
                  transferId: harvest.id,
                  unit: { id: 2 }, // Change unit to Cold Storage (ID: 2)
                  id: undefined, // Ensure a new record is created
                  status: workSheetTableStatus.ACTIVE,
                  transferStatus: 'P', // Mark as partially transferred
                  // transferId: harvest.id,
                });
                await queryRunner.manager.save(newHarvest);

                console.log(
                  decreaseBy * 5,
                  'millions',
                  harvest.count,
                  'frozen cups',
                );
              }
            }
          }
          if (remainingCount > 0) {
            // throw error if remaining count is still there
            throw new ConflictException(
              `Not enough transfered frozen cups to adjust the transit count, 
              Available transfered millions: ${autoConversionEntry.millions}. 
              Please reduce ${remainingCount * 5} more from transit count.`,
            );
          }
        }
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GetHarvestsDto } from 'src/worksheet/dto/get-harvests.dto';
import { Harvest } from 'src/worksheet/entities/harvest.entity';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';
import { getUnitValue } from 'src/worksheet/utils';
import { workSheetTableStatus } from 'src/worksheet/enums/worksheet-table-status.enum';
import { WorksheetTank } from 'src/worksheet/interfaces/active-worksheet.interface';

@Injectable()
export class GetHarvestsProvider {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(Worksheet)
    private readonly worksheetRepository: Repository<Worksheet>,
  ) {}

  // For Dashboard Count
  public async getTotalCountInStockOfActiveHarvests(
    getHarvestsDto: GetHarvestsDto,
  ): Promise<number> {
    // Fetch active harvests based on the filters
    const harvests = await this.harvestRepository.find({
      where: {
        unit: { id: getHarvestsDto.unitId },
        status: In(
          getHarvestsDto.statusIds || [
            workSheetTableStatus.ACTIVE,
            workSheetTableStatus.PARTIALLY_TRANSIT,
          ],
        ),
      },
    });

    // Calculate the total value of countInStock
    const totalCountInStock = harvests.reduce(
      (sum, harvest) => sum + (harvest.countInStock || 0),
      0,
    );

    return totalCountInStock;
  }

  public async getActiveHarvests(
    getHarvestsDto: GetHarvestsDto,
  ): Promise<{ data: any[]; totalRecords: number }> {
    const { unitId, statusIds, page = 1, limit = 10 } = getHarvestsDto;

    // Calculate pagination parameters
    const skip = (page - 1) * limit;
    const take = limit;

    // Fetch harvests with pagination
    const [harvests, totalRecords] = await this.harvestRepository.findAndCount({
      where: {
        unit: { id: unitId },
        status: In(
          statusIds || [
            workSheetTableStatus.ACTIVE,
            workSheetTableStatus.PARTIALLY_TRANSIT,
          ],
        ),
      },
      skip,
      take,
      order: {
        generatedAt: 'DESC', // Sort by generatedAt in descending order
      },
    });

    // Sort by tankType value (or id if value is not available)
    // harvests.sort((a, b) => {
    //   const aDate = a.generatedAt ? new Date(a.generatedAt).getTime() : 0;
    //   const bDate = b.generatedAt ? new Date(b.generatedAt).getTime() : 0;
    //   return bDate - aDate; // latest first
    // });

    const data = await Promise.all(
      harvests.map(async (harvest) => {
        const worksheet = await this.worksheetRepository.findOne({
          where: { id: harvest.worksheet.id },
          relations: ['tankType', 'harvestType'],
        });

        const { tankType, harvestType, tankNumber, id, inputCount, inputUnit } =
          worksheet || {};
        const inputValue = `${inputCount} ${getUnitValue(inputUnit)}`;
        return {
          ...harvest,
          unit: { id: harvest.unit.id, value: getUnitValue(harvest.unit) },
          measuredBy: {
            id: harvest.measuredBy.id,
            value: `${harvest.measuredBy.firstName} ${harvest.measuredBy.lastName}`,
          },
          worksheet: {
            tankNumber,
            id,
            tankType: tankType
              ? { id: tankType.id, value: tankType.value }
              : undefined,
            harvestType: harvestType
              ? { id: harvestType.id, value: harvestType.value }
              : undefined,
            inputSource: inputCount ? inputValue : '',
          },
        };
      }),
    );

    return { data, totalRecords };
  }

  public async getHarvestById(harvestId: number) {
    const harvest = await this.harvestRepository.findOne({
      where: { id: harvestId },
      relations: ['worksheet', 'unit', 'measuredBy'],
    });

    if (!harvest) {
      return null;
    }

    // get restock count from restock based on harvest id
    const restock = await this.harvestRepository.manager
      .getRepository('Restock')
      .createQueryBuilder('restock')
      .where('restock.harvestId = :harvestId', { harvestId })
      // .select('SUM(restock.count)', 'sum')
      .select(['restock.status AS status', 'SUM(restock.count) AS count'])
      .groupBy('restock.status')
      .getRawOne()
      .then((res: { count: string | null; status: string | null }) => {
        return res
          ? {
              restockStatus: res.status,
              restockCount: Number(res.count) || 0,
            }
          : {};
      });

    // Optionally, fetch worksheet details as in getActiveHarvests
    let worksheetDetails: WorksheetTank = {
      tankNumber: 0,
      tankType: undefined,
      harvestType: undefined,
    };
    if (harvest.worksheet) {
      const worksheet = await this.worksheetRepository.findOne({
        where: { id: harvest.worksheet.id },
        relations: ['tankType', 'harvestType'],
      });
      if (worksheet) {
        const inputValue = `${worksheet.inputCount} ${getUnitValue(worksheet.inputUnit)}`;
        worksheetDetails = {
          tankNumber: worksheet.tankNumber,
          tankType: worksheet.tankType
            ? { id: worksheet.tankType.id, value: worksheet.tankType.value }
            : undefined,
          harvestType: worksheet.harvestType
            ? {
                id: worksheet.harvestType.id,
                value: worksheet.harvestType.value,
              }
            : undefined,
          inputSource: worksheet.inputCount ? inputValue : '',
        };
      }
    }

    return {
      ...harvest,
      ...restock,
      unit: harvest.unit
        ? { id: harvest.unit.id, value: getUnitValue(harvest.unit) }
        : undefined,
      measuredBy: harvest.measuredBy
        ? {
            id: harvest.measuredBy.id,
            value: `${harvest.measuredBy.firstName} ${harvest.measuredBy.lastName}`,
          }
        : undefined,
      worksheet: worksheetDetails,
    };
  }
}

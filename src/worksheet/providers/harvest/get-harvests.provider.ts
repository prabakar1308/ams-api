import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { WorksheetUnit } from 'src/master/entities/worksheet-unit';
import { GetHarvestsDto } from 'src/worksheet/dto/get-harvests.dto';
import { Harvest } from 'src/worksheet/entities/harvest.entity';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';

@Injectable()
export class GetHarvestsProvider {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(Worksheet)
    private readonly worksheetRepository: Repository<Worksheet>,
  ) {}

  public async getActiveHarvests(getHarvestsDto: GetHarvestsDto) {
    const harvests = await this.harvestRepository.find({
      where: {
        unit: { id: getHarvestsDto.unitId },
        status: In(getHarvestsDto.statusIds || []),
      },
    });

    return await Promise.all(
      harvests.map(async (harvest) => {
        const worksheet = await this.worksheetRepository.findOne({
          where: { id: harvest.worksheetId },
          relations: ['tankType', 'harvestType'],
        });

        const { tankType, harvestType, tankNumber, id } = worksheet || {};
        return {
          ...harvest,
          unit: { id: harvest.unit.id, value: this.getUnitValue(harvest.unit) },
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
          },
        };
      }),
    );
  }

  private getUnitValue(unit: WorksheetUnit | undefined) {
    let unitName = '';
    if (unit) {
      unitName = unit.brand ? `${unit.value} - ${unit.brand}` : unit.value;
      if (unit.specs) unitName = `${unitName} (${unit.specs})`;
    }
    return unitName;
  }
}

import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { WorksheetUnit } from 'src/master/entities/worksheet-unit';
import { GetHarvestsDto } from 'src/worksheet/dto/get-harvests.dto';
import { Harvest } from 'src/worksheet/entities/harvest.entity';

@Injectable()
export class GetHarvestsProvider {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
  ) {}

  public async getActiveHarvests(getHarvestsDto: GetHarvestsDto) {
    console.log('getActiveHarvests', getHarvestsDto);
    const harvests = await this.harvestRepository.find({
      where: {
        unit: { id: getHarvestsDto.unitId },
        status: In(getHarvestsDto.statusIds || []),
      },
    });

    console.log('getActiveHarvests', harvests.length);

    return harvests.map((harvest) => {
      return {
        ...harvest,
        unit: { id: harvest.unit.id, value: this.getUnitValue(harvest.unit) },
        measuredBy: {
          id: harvest.measuredBy.id,
          value: `${harvest.measuredBy.firstName} ${harvest.measuredBy.lastName}`,
        },
      };
    });
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

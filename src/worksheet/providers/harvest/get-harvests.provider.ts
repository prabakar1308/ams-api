import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TankService } from 'src/master/providers/tank.service';
import { TankTypeService } from 'src/master/providers/tank-type.service';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import {
  ActiveWorksheet,
  WorksheetParameters,
  WorksheetTank,
} from '../interfaces/active-worksheet.interface';
import { GetWorksheetsDto } from '../dto/get-worksheets.dto';
import { Worksheet } from '../entities/worksheet.entity';
import { getDateDifference } from 'src/common/utils/generic-utils';
import { WorksheetUnit } from 'src/master/entities/worksheet-unit';
import { GetHarvestsDto } from 'src/worksheet/dto/get-harvests.dto';
import { Harvest } from 'src/worksheet/entities/harvest.entity';

@Injectable()
export class GetHarvestsProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly harvestRepository: Repository<Harvest>,
    private readonly tankService: TankService,
    private readonly tankTypeService: TankTypeService,
    private readonly configService: ConfigService,
  ) { }

  public async getActiveHarvests(getHarvestsDto: GetHarvestsDto) {
    const harvests = await this.harvestRepository.find({
      where: {
        unitId: getHarvestsDto.unitId,
        status: In(['A', 'P']),
      },
    });

    return harvests;
  }

  private getUnitValue(unit: WorksheetUnit | undefined) {
    let unitName = '';
    if (unit) {
      unitName = `${unit.value} - ${unit.brand}`;
      if (unit.specs) unitName = `${unitName} (${unit.specs})`;
    }
    return unitName;
  }
}

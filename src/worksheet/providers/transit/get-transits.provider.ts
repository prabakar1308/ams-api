import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Harvest } from 'src/worksheet/entities/harvest.entity';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';
import { Transit } from 'src/worksheet/entities/transit.entity';
import { getUnitValue } from 'src/worksheet/utils';
import { GetTransitsDto } from 'src/worksheet/dto/get-transits.dto';
import { UsersService } from 'src/users/providers/users.service';
import { TransitResponse } from 'src/worksheet/interfaces/transit.interface';

@Injectable()
export class GetTransitsProvider {
  constructor(
    @InjectRepository(Transit)
    private readonly transitRepository: Repository<Transit>,
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(Worksheet)
    private readonly worksheetRepository: Repository<Worksheet>,
    private readonly userService: UsersService,
  ) {}

  public async getCurrentTransits(
    getTransitsDto: GetTransitsDto,
  ): Promise<TransitResponse[]> {
    const days = getTransitsDto.days || 1;
    const dateThreshold = new Date();
    dateThreshold.setHours(0, 0, 0, 0);
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const transits = await this.transitRepository.find({
      where: {
        createdAt: MoreThanOrEqual(dateThreshold),
      },
    });

    // Transform the transits into the desired format
    return await Promise.all(
      transits.map(async (transit) => {
        const { harvest, createdAt, id, count, unit, unitSector, createdBy } =
          transit;

        const userName = await this.userService.getUserNameById(createdBy);

        return {
          id,
          createdAt,
          createdBy: userName,
          harvestCount: harvest
            ? `${harvest.count} ${getUnitValue(harvest.unit)}`
            : 'NA',
          transitCount: count ? `${count} ${getUnitValue(unit)}` : 'NA',
          unitSector: {
            name: unitSector.name,
            location: unitSector.location,
          },
        };
      }),
    );
  }
}

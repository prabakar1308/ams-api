import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { toZonedTime } from 'date-fns-tz';

import { Harvest } from 'src/worksheet/entities/harvest.entity';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';
import { Transit } from 'src/worksheet/entities/transit.entity';
import { getUnitValue } from 'src/worksheet/utils';
import { GetReportQueryDto } from 'src/worksheet/dto/get-report-query.dto';
import { UsersService } from 'src/users/providers/users.service';
import { TransitResponse } from 'src/worksheet/interfaces/transit.interface';
import { WorksheetUnit } from 'src/worksheet/enums/worksheet-units.enum';

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
    getTransitsReportDto: GetReportQueryDto,
  ): Promise<TransitResponse[]> {
    const days = getTransitsReportDto.days || 0;
    const dateThreshold = new Date();
    dateThreshold.setHours(0, 0, 0, 0);
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const transits = await this.transitRepository.find({
      where: {
        createdAt: MoreThanOrEqual(dateThreshold),
      },
      order: {
        unitSector: { name: 'ASC' },
        createdAt: 'DESC', // Order by latest first
      },
    });

    // Transform the transits into the desired format
    return await Promise.all(
      transits.map(async (transit) => {
        const {
          harvest,
          createdAt,
          id,
          count,
          unit,
          unitSector,
          createdBy,
          staffInCharge,
        } = transit;

        const userName = await this.userService.getUserNameById(createdBy);

        return {
          id,
          createdAt,
          createdBy: userName,
          staffInCharge,
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

  // For Dashboard Count
  public async getTransitsTotalCount(
    getTransitsReportDto: GetReportQueryDto,
  ): Promise<number> {
    const days = getTransitsReportDto.days || 0;
    const unitId = getTransitsReportDto.unitId || 0;

    // Calculate the date threshold and set time to 12:00 AM
    const dateThreshold = new Date();
    dateThreshold.setHours(0, 0, 0, 0);
    dateThreshold.setDate(dateThreshold.getDate() - days);

    // Fetch transits and calculate the total count
    const transits = await this.transitRepository.find({
      where: {
        createdAt: MoreThanOrEqual(dateThreshold),
        ...(unitId ? { unit: { id: unitId } } : {}),
      },
    });

    // Calculate the total count
    const totalCount = transits.reduce(
      (sum, transit) => sum + (transit.count || 0),
      0,
    );

    return totalCount;
  }

  public async getTransitsGroupedByUnitSectorAndShift(
    getTransitsReportDto: GetReportQueryDto,
  ): Promise<
    {
      unitSector: { name: string; location: string };
      totalTransitCount: string;
      millions: number;
      frozenCups: number;
      shifts: {
        dayShift: { totalTransitCount: number; transits: TransitResponse[] };
        nightShift: { totalTransitCount: number; transits: TransitResponse[] };
      };
    }[]
  > {
    const { startDate, endDate, unitId } = getTransitsReportDto;

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be provided');
    }

    // Parse the startDate and endDate
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    console.log(startDate, start, endDate, end);

    // Fetch transits created within the date range
    const transits = await this.transitRepository.find({
      where: {
        createdAt: Between(start, end),
        ...(unitId ? { unit: { id: unitId } } : {}),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // Group transits by unitSector
    const groupedTransits = await transits.reduce(
      async (accPromise, transit) => {
        const acc = await accPromise;
        const { unitSector, createdAt } = transit;

        if (!unitSector) {
          return acc; // Skip if unitSector is not defined
        }

        const sectorKey = unitSector.id;

        if (!acc[sectorKey]) {
          acc[sectorKey] = {
            unitSector: {
              name: unitSector.name,
              location: unitSector.location || '',
            },
            totalTransitCount: 0,
            millions: 0,
            frozenCups: 0,
            shifts: {
              dayShift: { totalTransitCount: 0, transits: [] },
              nightShift: { totalTransitCount: 0, transits: [] },
            },
          };
        }

        const transitCount = transit.count || 0;

        acc[sectorKey].totalTransitCount += transitCount;

        if (transit.unit.id === Number(WorksheetUnit.MILLIONS))
          acc[sectorKey].millions += transitCount;
        else if (transit.unit.id === Number(WorksheetUnit.FROZEN_CUPS))
          acc[sectorKey].frozenCups += transitCount;

        // Determine if the transit belongs to the day shift or night shift
        const timeZone = 'Asia/Kolkata';
        const localDate = toZonedTime(createdAt, timeZone);
        const hours = localDate.getHours();
        const shift = hours >= 6 && hours < 18 ? 'dayShift' : 'nightShift';
        // const hours = createdAt.getHours();
        // const shift = hours >= 6 && hours < 18 ? 'dayShift' : 'nightShift';

        const userName = await this.userService.getUserNameById(
          transit.createdBy,
        );

        acc[sectorKey].shifts[shift].transits.push({
          id: transit.id,
          createdAt: transit.createdAt,
          createdBy: userName,
          staffInCharge: transit.staffInCharge,
          harvestCount: transit.harvest
            ? `${transit.harvest.count} ${getUnitValue(transit.harvest.unit)}`
            : 'NA',
          transitCount: transit.count
            ? `${transit.count} ${getUnitValue(transit.unit)}`
            : 'NA',
          unitSector: {
            name: unitSector.name,
            location: unitSector.location,
          },
          worksheet: transit.harvest
            ? {
                tankType: transit.harvest.worksheet
                  ? transit.harvest.worksheet.tankType.value
                  : '',
                tankNumber: transit.harvest.worksheet
                  ? transit.harvest.worksheet.tankNumber
                  : 0,
              }
            : undefined,
        });

        // Increment the count for the respective shift
        acc[sectorKey].shifts[shift].totalTransitCount += transitCount;

        return acc;
      },
      Promise.resolve(
        {} as Record<
          string,
          {
            unitSector: { name: string; location: string };
            totalTransitCount: number;
            millions: number;
            frozenCups: number;
            shifts: {
              dayShift: {
                totalTransitCount: number;
                transits: TransitResponse[];
              };
              nightShift: {
                totalTransitCount: number;
                transits: TransitResponse[];
              };
            };
          }
        >,
      ),
    );

    // Convert grouped object to an array and format totalTransitCount
    return Object.values(groupedTransits).map((group) => ({
      ...group,
      totalTransitCount: `${group.totalTransitCount} units`,
    }));
  }
}

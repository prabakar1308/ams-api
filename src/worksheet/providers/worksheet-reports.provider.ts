import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Between, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { GetReportQueryDto } from '../dto/get-report-query.dto';

@Injectable()
export class WorksheetReportsProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    private readonly configService: ConfigService,
  ) {}

  public async getInputUnitsReport(getTransitsReportDto: GetReportQueryDto) {
    const { startDate, endDate } = getTransitsReportDto;

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be provided');
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );

    const worksheets = await this.worksheetRespository.find({
      where: {
        createdAt: Between(start, end),
        status: { id: In([worksheetCompletedStatusId]) },
      },
      relations: ['inputUnit', 'tankType'],
    });

    // Segregate by tankType, then by inputUnit
    const report = worksheets.reduce(
      (acc, ws) => {
        const tankTypeId = ws.tankType?.id;
        const tankTypeName = ws.tankType?.value || 'Unknown';
        const unitId = ws.inputUnit?.id;
        if (!tankTypeId || !unitId) return acc;

        if (!acc[tankTypeId]) {
          acc[tankTypeId] = {
            tankTypeId,
            tankTypeName,
            inputUnits: {},
          };
        }

        if (!acc[tankTypeId].inputUnits[unitId]) {
          acc[tankTypeId].inputUnits[unitId] = {
            id: unitId,
            name: ws.inputUnit.value,
            brand: ws.inputUnit.brand || '',
            spec: ws.inputUnit.specs || '',
            count: 0,
          };
        }
        acc[tankTypeId].inputUnits[unitId].count += ws.inputCount || 0;
        return acc;
      },
      {} as Record<
        number,
        {
          tankTypeId: number;
          tankTypeName: string;
          inputUnits: Record<
            number,
            {
              id: number;
              name: string;
              brand: string;
              spec: string;
              count: number;
            }
          >;
        }
      >,
    );

    // Overall aggregation by inputUnit
    const overall = worksheets.reduce(
      (acc, ws) => {
        const unitId = ws.inputUnit?.id;
        if (!unitId) return acc;
        if (!acc[unitId]) {
          acc[unitId] = {
            id: unitId,
            name: ws.inputUnit.value,
            brand: ws.inputUnit.brand || '',
            spec: ws.inputUnit.specs || '',
            count: 0,
          };
        }
        acc[unitId].count += ws.inputCount || 0;
        return acc;
      },
      {} as Record<
        number,
        {
          id: number;
          name: string;
          brand: string;
          spec: string;
          count: number;
        }
      >,
    );

    return {
      byTankType: Object.values(report).map((tankType) => ({
        tankTypeId: tankType.tankTypeId,
        tankTypeName: tankType.tankTypeName,
        inputUnits: Object.values(tankType.inputUnits),
      })),
      overall: Object.values(overall),
    };
  }
}

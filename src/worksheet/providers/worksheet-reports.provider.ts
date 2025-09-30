import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Between, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { GetReportQueryDto } from '../dto/get-report-query.dto';
import { SourceTrackerService } from 'src/master/providers/source-tracker.service';

@Injectable()
export class WorksheetReportsProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    private readonly sourceTrackerService: SourceTrackerService,
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

    // get all worksheets that were harvested (4 - completed & 6- in washing) within the date range
    const worksheets = await this.worksheetRespository.find({
      where: {
        generatedAt: Between(start, end),
        status: { id: In([4, 6]) },
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

  public async getCurrentInputUnitsReport() {
    // Fetch all worksheets that are in culture and ready for harvest

    const worksheets = await this.worksheetRespository.find({
      where: {
        status: { id: In([2, 3]) },
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

  public async getAvailableInputUnitsReport() {
    const worksheets = await this.worksheetRespository.find({
      where: {
        status: { id: In([2, 3, 4, 6]) },
      },
      relations: ['inputUnit'],
    });

    const overallInputsAvailableCount =
      await this.sourceTrackerService.getSourceTrackerDetails();

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

    const overallInputsUsedCount = Object.values(overall);

    // Adjust counts based on source tracker data
    const overallInputCount = overallInputsAvailableCount.map((available) => {
      const used = overallInputsUsedCount.find(
        (used) => used.id === available.unitSource,
      );
      return { ...used, count: available.totalCount - (used?.count || 0) };
    });

    return overallInputCount;
  }
}

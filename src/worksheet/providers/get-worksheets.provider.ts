import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TankService } from 'src/master/providers/tank.service';
import { TankTypeService } from 'src/master/providers/tank-type.service';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import { getDateDifference } from 'src/common/utils/generic-utils';
import {
  ActiveWorksheet,
  WorksheetParameters,
  WorksheetTank,
} from '../interfaces/active-worksheet.interface';
import { GetWorksheetsDto } from '../dto/get-worksheets.dto';
import { Worksheet } from '../entities/worksheet.entity';
import { getUnitValue } from '../utils';

@Injectable()
export class GetWorksheetsProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    private readonly tankService: TankService,
    private readonly tankTypeService: TankTypeService,
    private readonly configService: ConfigService,
  ) {}

  public async getActiveWorksheets(getWorksheetStatusDto: GetWorksheetsDto) {
    const tankDetails = await this.tankService.getTankDetails();
    const tankType = await this.tankTypeService.getTankTypesById(
      getWorksheetStatusDto.tankTypeId ?? 1,
    );
    const worksheets = tankType
      ? await this.worksheetRespository.findBy({
          tankType: { id: tankType.id },
        })
      : [];
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    let activeWorksheets: ActiveWorksheet[] = [];

    if (tankDetails && worksheets) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.status.id !== worksheetCompletedStatusId,
        );
        activeWorksheets.push({
          tankNumber: index,
          worksheet: filteredWorksheet.length ? filteredWorksheet[0] : null,
        });
      }
    } else {
      throw new Error('Tank Details or Worksheets are not available.');
    }
    if (getWorksheetStatusDto.statusId) {
      activeWorksheets =
        getWorksheetStatusDto.statusId ===
        (worksheetStatus.OPEN as typeof getWorksheetStatusDto.statusId)
          ? activeWorksheets.filter(({ worksheet }) => worksheet === null)
          : activeWorksheets.filter(
              ({ worksheet }) =>
                worksheet?.status.id === getWorksheetStatusDto.statusId,
            );
    }
    if (getWorksheetStatusDto.userId) {
      activeWorksheets = activeWorksheets.filter(
        ({ worksheet }) =>
          worksheet?.user && worksheet.user.id === getWorksheetStatusDto.userId,
      );
    }

    if (getWorksheetStatusDto.harvestTypeId) {
      activeWorksheets = activeWorksheets.filter(
        ({ worksheet }) =>
          worksheet?.harvestType &&
          worksheet.harvestType.id === getWorksheetStatusDto.harvestTypeId,
      );
    }

    return this.formatWorksheetData(activeWorksheets);
  }

  private formatWorksheetData(
    activeWorksheets: ActiveWorksheet[],
  ): WorksheetTank[] {
    return activeWorksheets.map(({ tankNumber, worksheet }) => {
      const {
        id,
        tankType,
        harvestType,
        status,
        user,
        inputCount,
        inputUnit,
        harvestTime,
        harvestHours,
        generatedAt,
        harvestedAt,
        ph,
        salnity,
        temperature,
      } = worksheet || {};

      let dateInput = harvestTime;

      if (status && status.id) {
        if (Number(status.id) === Number(worksheetStatus.READY_FOR_STOCKING))
          dateInput = generatedAt;
        else if (Number(status.id) === Number(worksheetStatus.WASHING))
          dateInput = harvestedAt;
      }

      const parameters: WorksheetParameters[] = [];
      const inputValue = `${inputCount} ${getUnitValue(inputUnit)}`;

      parameters.push({ label: 'Input', value: inputValue });
      if (ph) parameters.push({ label: 'PH', value: ph.toString() });

      if (salnity)
        parameters.push({ label: 'Salnity', value: salnity.toString() });
      if (temperature)
        parameters.push({
          label: 'Temperature',
          value: temperature.toString(),
        });

      return {
        tankNumber,
        worksheetId: id || 0,
        tankType: tankType
          ? { id: tankType.id, value: tankType.value }
          : undefined,
        harvestType: harvestType
          ? { id: harvestType.id, value: harvestType.value }
          : undefined,
        status: status ? { id: status.id, value: status.value } : undefined,
        assignedUser: user
          ? { id: user.id, value: `${user.firstName} ${user.lastName}` }
          : undefined,
        inputSource: inputCount ? inputValue : '',
        harvestHours,
        timeDifference: getDateDifference(dateInput, status ? status.id : 0),
        generatedAt,
        parameters,
      };
    });
  }

  public async getActiveWorksheetsByTankType(
    tankTypeId: number,
  ): Promise<Worksheet[]> {
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );

    // Fetch worksheets where tankType matches and status is not completed
    const worksheets = await this.worksheetRespository.find({
      where: {
        tankType: { id: tankTypeId },
        status: { id: Not(worksheetCompletedStatusId) },
      },
    });

    return worksheets;
  }

  public async getWorksheetsInStockingGroupedByInputUnit(
    tankTypeId: number,
  ): Promise<
    { inputUnitId: number; inputUnitName: string; totalInputCount: number }[]
  > {
    // Fetch worksheets with In Culture status
    const worksheets = await this.worksheetRespository.find({
      where: {
        tankType: { id: tankTypeId },
        status: { id: worksheetStatus.IN_CULTURE },
      },
      // relations: ['inputUnit'], // Include inputUnit relation to access unit details
    });

    // Group by inputUnitId and calculate total inputCount
    const groupedData = worksheets.reduce(
      (acc, worksheet) => {
        const inputUnitId = worksheet.inputUnit?.id;
        const inputUnitName = getUnitValue(worksheet.inputUnit);
        const inputCount = worksheet.inputCount || 0;

        if (!inputUnitId) {
          return acc; // Skip if inputUnitId is not defined
        }

        if (!acc[inputUnitId]) {
          acc[inputUnitId] = { inputUnitId, inputUnitName, totalInputCount: 0 };
        }

        acc[inputUnitId].totalInputCount += inputCount;

        return acc;
      },
      {} as Record<
        number,
        { inputUnitId: number; inputUnitName: string; totalInputCount: number }
      >,
    );

    // Convert grouped data into an array
    return Object.values(groupedData);
  }
}

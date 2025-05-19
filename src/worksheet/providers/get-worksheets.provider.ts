import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TankService } from 'src/master/providers/tank.service';
import { TankTypeService } from 'src/master/providers/tank-type.service';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import { getDateDifference } from 'src/common/utils/generic-utils';
import { WorksheetUnit } from 'src/master/entities/worksheet-unit';
import {
  ActiveWorksheet,
  WorksheetParameters,
  WorksheetTank,
} from '../interfaces/active-worksheet.interface';
import { GetWorksheetsDto } from '../dto/get-worksheets.dto';
import { Worksheet } from '../entities/worksheet.entity';

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
        createdAt,
        ph,
        salnity,
        temperature,
      } = worksheet || {};

      const dateInput =
        status &&
        status.id &&
        Number(status.id) === Number(worksheetStatus.READY_FOR_STOCKING)
          ? createdAt
          : harvestTime;

      const parameters: WorksheetParameters[] = [];
      const inputValue = `${inputCount} ${this.getUnitValue(inputUnit)}`;

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
        parameters,
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

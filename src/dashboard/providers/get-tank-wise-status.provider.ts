import { Injectable } from '@nestjs/common';
import { WorksheetService } from 'src/worksheet/providers/worksheet.service';
import { ConfigService } from '@nestjs/config';
import { TankService } from 'src/master/providers/tank.service';
import { TankWiseStatus } from '../interfaces/tank-wise-status';
import { worksheetStatus } from '../enums/worksheet-status.enum';
import { WorksheetStatusService } from 'src/master/providers/worksheet-status.service';

@Injectable()
export class GetTankWiseStatusProvider {
  constructor(
    private readonly tankService: TankService,
    private readonly worksheetService: WorksheetService,
    private readonly configService: ConfigService,
    private readonly worksheetStatusService: WorksheetStatusService,
  ) {}

  private groupAndSum(arr: TankWiseStatus[]) {
    const result: { [key: number]: TankWiseStatus } = {};

    arr.forEach((item) => {
      const id = item.id;
      if (id || id === 0) {
        if (result[id]) {
          result[id].value += item.value;
          if (result[id].description) {
            result[id].description += `, ${item.description}`;
          }
        } else {
          result[id] = { ...item };
        }
      }
    });
    return Object.values(result);
  }

  public async getTankWiseStatus(tankTypeId: number) {
    // const user = await this.usersService.findOneByUserId(
    //   getWorksheetStatusDto.userId[0],
    // );
    const tankDetails = await this.tankService.getTankDetails();
    const worksheets =
      await this.worksheetService.getActiveWorksheetsByTankType(tankTypeId);
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    const tankStatuses: TankWiseStatus[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.tankType.id === tankTypeId &&
            sheet.status.id !== worksheetCompletedStatusId,
        );
        tankStatuses.push({
          id: filteredWorksheet.length
            ? filteredWorksheet[0].status.id
            : worksheetStatus.OPEN,
          name: filteredWorksheet.length
            ? filteredWorksheet[0].status.value
            : 'Empty',
          value: 1,
        });
      }
    }
    const result = this.groupAndSum(tankStatuses);

    const worksheetStatuses =
      await this.worksheetStatusService.getWorksheetStatus();
    return worksheetStatuses
      .filter((ws) => ws.id !== (worksheetStatus.COMPLETE as typeof ws.id))
      .map((status) => {
        const tankWiseStatus = result.find((item) => item.id === status.id);
        return {
          id: status.id,
          name: status.value,
          value: tankWiseStatus ? tankWiseStatus.value : 0,
        };
      });
  }

  public async getUsersByTankWise(tankTypeId: number) {
    // const user = await this.usersService.findOneByUserId(
    //   getWorksheetStatusDto.userId[0],
    // );
    const tankDetails = await this.tankService.getTankDetails();
    const worksheets =
      await this.worksheetService.getActiveWorksheetsByTankType(tankTypeId);
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    const tankStatuses: TankWiseStatus[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.tankType?.id === tankTypeId &&
            sheet.status.id !== worksheetCompletedStatusId,
        );
        tankStatuses.push({
          id: filteredWorksheet.length ? filteredWorksheet[0].user?.id : 0,
          name: filteredWorksheet.length
            ? `${filteredWorksheet[0].user?.firstName} ${filteredWorksheet[0].user?.lastName}`
            : 'Empty',
          value: 1,
          description: `Tank ${index}`,
        });
      }
    }

    return this.groupAndSum(tankStatuses);
  }

  public async getTankListWithStatus(tankTypeId: number) {
    const tankDetails = await this.tankService.getTankDetails();
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    const worksheets =
      await this.worksheetService.getActiveWorksheetsByTankType(tankTypeId);

    const result: {
      tankNumber: number;
      statusId: number;
      statusName: string;
      statusShort?: string;
    }[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.tankType?.id === tankTypeId &&
            sheet.status.id !== worksheetCompletedStatusId,
        );
        const statusId = filteredWorksheet.length
          ? filteredWorksheet[0].status.id
          : worksheetStatus.OPEN;
        const statusName = filteredWorksheet.length
          ? filteredWorksheet[0].status.value
          : 'Empty';
        const statusShort = filteredWorksheet.length
          ? filteredWorksheet[0].status.shortName
          : 'empty';
        result.push({
          tankNumber: index,
          statusId,
          statusName,
          statusShort,
        });
      }
    }
    return result;
  }
}

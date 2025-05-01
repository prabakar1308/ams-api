import { Injectable } from '@nestjs/common';
import { WorksheetService } from 'src/worksheet/providers/worksheet.service';
import { ConfigService } from '@nestjs/config';
import { TankService } from 'src/master/providers/tank.service';
import { TankWiseStatus } from '../interfaces/tank-wise-status';
import { worksheetStatus } from '../enums/worksheet-status.enum';

@Injectable()
export class GetTankWiseStatusProvider {
  constructor(
    private readonly tankService: TankService,
    private readonly worksheetService: WorksheetService,
    private readonly configService: ConfigService,
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
    const worksheets = await this.worksheetService.getWorksheets({
      limit: 25,
      page: 1,
    });
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    const tankStatuses: TankWiseStatus[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.data.filter(
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
            : 'Free/Open',
          value: 1,
        });
      }
    }

    return this.groupAndSum(tankStatuses);
  }

  public async getUsersByTankWise(tankTypeId: number) {
    // const user = await this.usersService.findOneByUserId(
    //   getWorksheetStatusDto.userId[0],
    // );
    const tankDetails = await this.tankService.getTankDetails();
    const worksheets = await this.worksheetService.getWorksheets({
      limit: 25,
      page: 1,
    });
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    const tankStatuses: TankWiseStatus[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.data.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.tankType?.id === tankTypeId &&
            sheet.status.id !== worksheetCompletedStatusId,
        );
        tankStatuses.push({
          id: filteredWorksheet.length ? filteredWorksheet[0].user?.id : 0,
          name: filteredWorksheet.length
            ? `${filteredWorksheet[0].user?.firstName} ${filteredWorksheet[0].user?.lastName}`
            : 'Free/Open',
          value: 1,
          description: `Tank ${index}`,
        });
      }
    }

    return this.groupAndSum(tankStatuses);
  }
}

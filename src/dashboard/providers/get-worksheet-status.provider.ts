import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveWorksheet } from '../interfaces/active-worksheet.interface';
import { WorksheetService } from 'src/worksheet/providers/worksheet.service';
import { ConfigService } from '@nestjs/config';
import { GetWorksheetStatusDto } from '../dto/get-worksheet-status.dto';
import { TankService } from 'src/master/providers/tank.service';

@Injectable()
export class GetWorksheetStatusProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tankService: TankService,
    private readonly worksheetService: WorksheetService,
    private readonly configService: ConfigService,
  ) {}

  public async getActiveWorksheets(
    getWorksheetStatusDto: GetWorksheetStatusDto,
  ) {
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
    let activeWorksheets: ActiveWorksheet[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = +min; index <= max; index++) {
        const filteredWorksheet = worksheets.data.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.status.id !== worksheetCompletedStatusId,
        );
        activeWorksheets.push({
          tankNumber: index,
          worksheet: filteredWorksheet.length ? filteredWorksheet[0] : null,
        });
      }
    }

    if (getWorksheetStatusDto.tankTypeId) {
      activeWorksheets = activeWorksheets.filter(
        (worksheet) =>
          worksheet.worksheet?.tankType.id === getWorksheetStatusDto.tankTypeId,
      );
    }
    if (getWorksheetStatusDto.statusId) {
      activeWorksheets = activeWorksheets.filter(
        (worksheet) =>
          worksheet.worksheet?.status.id === getWorksheetStatusDto.statusId,
      );
    }
    if (getWorksheetStatusDto.userId) {
      activeWorksheets = activeWorksheets.filter(
        (worksheet) =>
          worksheet.worksheet?.user &&
          worksheet.worksheet.user.id === getWorksheetStatusDto.userId,
      );
    }

    return activeWorksheets;
  }
}

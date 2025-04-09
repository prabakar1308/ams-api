import { Injectable } from '@nestjs/common';
import { MasterService } from 'src/master/providers/master.service';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveWorksheet } from '../interfaces/active-worksheet.interface';
import { WorksheetService } from 'src/worksheet/providers/worksheet.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private masterService: MasterService,
    private worksheetService: WorksheetService,
    private configService: ConfigService,
  ) {}

  public async getActiveWorksheets(id: number) {
    const user = await this.usersService.findOneById(id);
    const tankDetails = await this.masterService.getTankDetails();
    const worksheets = await this.worksheetService.getWorksheets({
      limit: 25,
      page: 1,
    });
    const worksheetCompletedStatusId = +this.configService.get(
      'WORKSHEET_COMPLETED_STATUS',
    );
    const activeWorksheets: ActiveWorksheet[] = [];

    if (tankDetails) {
      const { min, max } = tankDetails;
      for (let index = min; index <= max; index++) {
        const filteredWorksheet = worksheets.data.filter(
          (sheet) =>
            sheet.tankNumber === index &&
            sheet.statusId !== worksheetCompletedStatusId,
        );
        activeWorksheets.push({
          tankNumber: index,
          user,
          worksheet: filteredWorksheet.length ? filteredWorksheet[0] : null,
        });
      }
    }

    return activeWorksheets;
  }
}

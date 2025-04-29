import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/users/providers/users.service';
import { ActiveWorksheet } from '../interfaces/active-worksheet.interface';
// import { WorksheetService } from 'src/worksheet/providers/worksheet.service';
import { TankService } from 'src/master/providers/tank.service';
import { GetWorksheetsDto } from '../dto/get-worksheets.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Worksheet } from '../entities/worksheet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetWorksheetsProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    private readonly usersService: UsersService,
    private readonly tankService: TankService,
    // private readonly worksheetService: WorksheetService,
    private readonly configService: ConfigService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getActiveWorksheets(getWorksheetStatusDto: GetWorksheetsDto) {
    const tankDetails = await this.tankService.getTankDetails();
    const worksheets = await this.paginationProvider.paginateQuery<Worksheet>(
      {
        limit: getWorksheetStatusDto.limit,
        page: getWorksheetStatusDto.page,
      },
      this.worksheetRespository,
    );
    // const worksheets = await this.worksheetService.getWorksheets({
    //   limit: 25,
    //   page: 1,
    // });
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
      activeWorksheets = activeWorksheets.filter(({ worksheet }) =>
        worksheet
          ? worksheet?.tankType?.id === getWorksheetStatusDto.tankTypeId
          : true,
      );
    }
    if (getWorksheetStatusDto.statusId) {
      activeWorksheets = activeWorksheets.filter(
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

    return activeWorksheets;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TankService } from 'src/master/providers/tank.service';
import { TankTypeService } from 'src/master/providers/tank-type.service';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';
import { ActiveWorksheet } from '../interfaces/active-worksheet.interface';
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

    return activeWorksheets;
  }
}

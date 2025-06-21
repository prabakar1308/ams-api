import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { WorksheetStatusService } from 'src/master/providers/worksheet-status.service';
import { UsersService } from 'src/users/providers/users.service';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
import { HarvestTypeService } from 'src/master/providers/harvest-type.service';
import { TankTypeService } from 'src/master/providers/tank-type.service';
// import { UnitService } from 'src/master/providers/unit.service';
import { Restock } from '../entities/restock.entity';
import { WorksheetUnitService } from 'src/master/providers/worksheet-unit.service';
// import { Harvest } from '../entities/harvest.entity';

@Injectable()
export class WorksheetDependentsProvider {
  constructor(
    @InjectRepository(Restock)
    private readonly restockRespository: Repository<Restock>,
    private readonly worksheetStatusService: WorksheetStatusService,
    private readonly userService: UsersService,
    private readonly harvestTypeService: HarvestTypeService,
    private readonly tankTypeService: TankTypeService,
    private readonly unitService: WorksheetUnitService,
  ) {}

  public async findMultipleRestocks(restocks: number[]) {
    return await this.restockRespository.find({
      where: {
        id: In(restocks),
      },
    });
  }

  public async getWorksheetUser(
    worksheet: CreateWorksheetDto | PatchWorksheetDto,
  ) {
    let user: Worksheet['user'] | null = null;
    if (worksheet.userId) {
      // check if userId is valid
      const fetchedUser = await this.userService.findOneById(worksheet.userId);

      if (!fetchedUser) {
        throw new Error('Assigned User not found');
      }

      user = fetchedUser;
    }
    return user;
  }

  public async getWorksheetStatus(
    worksheet: CreateWorksheetDto | PatchWorksheetDto,
  ) {
    let status: Worksheet['status'] | null = null;
    if (worksheet.statusId) {
      // check if statusId is valid
      const fetchedStatus =
        await this.worksheetStatusService.getWorksheetStatusById(
          worksheet.statusId,
        );

      if (!fetchedStatus) {
        throw new Error('Worksheet Status not found');
      }

      status = fetchedStatus;
    }

    return status;
  }

  public async getWorksheetTankType(worksheet: CreateWorksheetDto) {
    let tankType: Worksheet['tankType'] | null = null;
    if (worksheet.tankTypeId) {
      const fetchedTankType = await this.tankTypeService.getTankTypesById(
        worksheet.tankTypeId,
      );

      if (!fetchedTankType) {
        throw new Error('Worksheet Tank Type not found');
      }

      tankType = fetchedTankType;
    }

    return tankType;
  }

  public async getWorksheetHarvestType(
    worksheet: CreateWorksheetDto | PatchWorksheetDto,
  ) {
    let harvestType: Worksheet['harvestType'] | null = null;
    if (worksheet.harvestTypeId) {
      const fetchedHarvestType =
        await this.harvestTypeService.getHarvestTypeById(
          worksheet.harvestTypeId,
        );

      if (!fetchedHarvestType) {
        throw new Error('Worksheet Tank Type not found');
      }

      harvestType = fetchedHarvestType;
    }

    return harvestType;
  }

  public async getWorksheetInputUnit(
    worksheet: CreateWorksheetDto | PatchWorksheetDto,
  ) {
    let inputUnit: Worksheet['inputUnit'] | null = null;
    if (worksheet.inputUnitId) {
      const fetchedUnit = await this.unitService.getWorksheetUnitById(
        worksheet.inputUnitId,
      );

      if (!fetchedUnit) {
        throw new Error('Worksheet Unit Id not found');
      }

      inputUnit = fetchedUnit;
    }

    return inputUnit;
  }
}

import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { WorksheetStatusService } from './providers/worksheet-status.service';
import { PatchGenericDto } from './dto/patch-base-generic.dto';
import { PatchRangeGenericDto } from './dto/patch-range-generic.dto';
import { HarvestTypeService } from './providers/harvest-type.service';
import { PatchHarvestTypeDto } from './dto/patch-harvest-type.dto';
import { PHService } from './providers/ph.service';
import { SalnityService } from './providers/salnity.service';
import { TankService } from './providers/tank.service';
import { TankTypeService } from './providers/tank-type.service';
import { PatchTankTypeDto } from './dto/patch-tank-type.dto';
import { TemperatureService } from './providers/temperature.service';
import { UnitService } from './providers/unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { PatchUnitDto } from './dto/patch-unit.dto';
import { UnitSectorService } from './providers/unit-sector.service';
import { CreateUnitSectorDto } from './dto/create-unit-sector.dto';
import { PatchUnitSectorDto } from './dto/patch-unit-sector.dto';

@Controller('master')
export class MasterController {
  constructor(
    private readonly worksheetStatusService: WorksheetStatusService,
    private readonly harvestTypeService: HarvestTypeService,
    private readonly phService: PHService,
    private readonly salnityService: SalnityService,
    private readonly tankService: TankService,
    private readonly tankTypeService: TankTypeService,
    private readonly temperatureService: TemperatureService,
    private readonly unitService: UnitService,
    private readonly unitSectorService: UnitSectorService,
  ) {}

  /** Harvest Type - GET, PATCH */
  @Get('harvest-type')
  public getHarvestTypes() {
    return this.harvestTypeService.getHarvestTypes();
  }
  @Patch('harvest-type')
  public updateHarvestType(@Body() patchHarvestTypeDto: PatchHarvestTypeDto) {
    return this.harvestTypeService.updateHarvestType(patchHarvestTypeDto);
  }

  /** PH - GET, PATCH */
  @Get('ph')
  public getPh() {
    return this.phService.getPH();
  }
  @Patch('ph')
  public updatePh(@Body() patchPHDto: PatchRangeGenericDto) {
    return this.phService.updatePH(patchPHDto);
  }

  /** Salnity - GET, PATCH */
  @Get('salnity')
  public getSalnity() {
    return this.salnityService.getSalnity();
  }
  @Patch('salnity')
  public updateSalnity(@Body() patchSalnityDto: PatchRangeGenericDto) {
    return this.salnityService.updateSalnity(patchSalnityDto);
  }

  /** Temperature - GET, PATCH */
  @Get('temperature')
  public getTemperature() {
    return this.temperatureService.getTemperature();
  }
  @Patch('temperature')
  public updateTemperature(@Body() patchTempDto: PatchRangeGenericDto) {
    return this.temperatureService.updateTemperature(patchTempDto);
  }

  /** Tank - GET, PATCH */
  @Get('tank')
  public getTanks() {
    return this.salnityService.getSalnity();
  }
  @Patch('tank')
  public updateTanks(@Body() patchTankDto: PatchRangeGenericDto) {
    return this.tankService.updateTank(patchTankDto);
  }

  /** Tank Types - GET, PATCH */
  @Get('tank-types')
  public getTankTypes() {
    return this.tankTypeService.getTankTypes();
  }
  @Patch('tank-type')
  public updateTankType(@Body() patchTankTypeDto: PatchTankTypeDto) {
    return this.tankTypeService.updateTankType(patchTankTypeDto);
  }

  /** Unit - GET, CREATE, PATCH */
  @Get('unit')
  public getUnits() {
    return this.unitService.getUnits();
  }

  @Post('unit')
  public createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.createUnit(createUnitDto);
  }

  @Patch('unit')
  public updateUnit(@Body() patchUnitDto: PatchUnitDto) {
    return this.unitService.updateUnit(patchUnitDto);
  }

  /** Unit Sector - GET, CREATE, PATCH */
  @Get('unit-sector')
  public getUnitSectors() {
    return this.unitSectorService.getUnitSectors();
  }

  @Post('unit-sector')
  public createUnitSector(@Body() createUnitSectorDto: CreateUnitSectorDto) {
    return this.unitSectorService.createUnitSector(createUnitSectorDto);
  }

  @Patch('unit-sector')
  public updateUnitSector(@Body() patchUnitSectorDto: PatchUnitSectorDto) {
    return this.unitSectorService.updateUnitSector(patchUnitSectorDto);
  }

  /** Worksheet Status - GET, PATCH */
  @Get('worksheet-status')
  public getWorksheetStatus() {
    return this.worksheetStatusService.getWorksheetStatus();
  }

  @Patch('worksheet-status')
  public updateWorksheetStatus(
    @Body() patchWorksheetStatusDto: PatchGenericDto,
  ) {
    return this.worksheetStatusService.updateWorksheetStatus(
      patchWorksheetStatusDto,
    );
  }
}

import { Module } from '@nestjs/common';
import { MasterController } from './master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksheetStatus } from './entities/worksheet-status.entity';
import { HarvestType } from './entities/harvest-type.entity';
import { TankType } from './entities/tank-type.entity';
import { WorksheetStatusService } from './providers/worksheet-status.service';
import { Tank } from './entities/tank.entity';
import { Ph } from './entities/ph.entity';
import { Temperature } from './entities/temperature.entity';
import { Salnity } from './entities/salnity.entity';
import { UnitSector } from './entities/unit-sector.entity';
import { Unit } from './entities/unit.entity';
import { HarvestTypeService } from './providers/harvest-type.service';
import { PHService } from './providers/ph.service';
import { SalnityService } from './providers/salnity.service';
import { TankService } from './providers/tank.service';
import { TankTypeService } from './providers/tank-type.service';
import { TemperatureService } from './providers/temperature.service';
import { UnitService } from './providers/unit.service';
import { UnitSectorService } from './providers/unit-sector.service';
import { WorksheetUnit } from './entities/worksheet-unit';
import { WorksheetUnitService } from './providers/worksheet-unit.service';
import { HarvestUnit } from './entities/harvest-unit.entity';
import { HarvestUnitService } from './providers/harvest-unit.service';

@Module({
  controllers: [MasterController],
  providers: [
    WorksheetStatusService,
    HarvestTypeService,
    PHService,
    SalnityService,
    TankService,
    TankTypeService,
    TemperatureService,
    UnitService,
    UnitSectorService,
    WorksheetUnitService,
    HarvestUnitService
  ],
  imports: [
    TypeOrmModule.forFeature([
      WorksheetStatus,
      HarvestType,
      TankType,
      Tank,
      Ph,
      Temperature,
      Salnity,
      UnitSector,
      Unit,
      WorksheetUnit,
      HarvestUnit,
    ]),
  ], // Add your entities here
  exports: [
    WorksheetStatusService,
    HarvestTypeService,
    TankService,
    TankTypeService,
    UnitSectorService,
    UnitService,
    WorksheetUnitService,
    HarvestUnitService,
  ],
})
export class MasterModule { }

import { Module } from '@nestjs/common';
import { MasterController } from './master.controller';
import { MasterService } from './providers/master.service';
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

@Module({
  controllers: [MasterController],
  providers: [MasterService, WorksheetStatusService],
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
    ]),
  ], // Add your entities here
  exports: [MasterService, WorksheetStatusService],
})
export class MasterModule {}

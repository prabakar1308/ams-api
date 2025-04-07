import { Module } from '@nestjs/common';
import { MasterController } from './master.controller';
import { MasterService } from './providers/master.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksheetStatus } from './worksheet-status.entity';
import { HarvestType } from './harvest-type.entity';
import { TankType } from './tank-type.entity';
import { WorksheetStatusService } from './providers/worksheet-status.service';

@Module({
  controllers: [MasterController],
  providers: [MasterService, WorksheetStatusService],
  imports: [TypeOrmModule.forFeature([WorksheetStatus, HarvestType, TankType])], // Add your entities here
})
export class MasterModule {}

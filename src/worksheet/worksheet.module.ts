import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { MasterModule } from 'src/master/master.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

import { WorksheetController } from './worksheet.controller';
import { WorksheetService } from './providers/worksheet.service';
import { WorksheetCreateManyProvider } from './providers/worksheet-create-many.provider';
import { WorksheetCreateProvider } from './providers/worksheet-create.provider';
import { WorksheetDependentsProvider } from './providers/worksheet-dependents.provider';
import { Worksheet } from './entities/worksheet.entity';
import { Harvest } from './entities/harvest.entity';
import { Restock } from './entities/restock.entity';
import { MonitoringCount } from './entities/monitoring-count.entity';
import { WorksheetHistory } from './entities/worksheet-history.entity';
import { WorksheetUpdateManyProvider } from './providers/worksheet-update-many.provider';
import { WorksheetHarvestManyProvider } from './providers/harvest/worksheet-harvest-many.provider';
import { WorksheetTasksProvider } from './providers/worksheet-tasks.provider';
import { Transit } from './entities/transit.entity';
import { WorksheetTransitManyProvider } from './providers/transit/worksheet-transit-many.provider';
import { GetWorksheetsProvider } from './providers/get-worksheets.provider';
import { RestockService } from './providers/restock/restock.service';
import { GetHarvestsProvider } from './providers/harvest/get-harvests.provider';
import { GetTransitsProvider } from './providers/transit/get-transits.provider';
import { WorksheetReportsProvider } from './providers/worksheet-reports.provider';
import { WorksheetUpdateProvider } from './providers/worksheet-update.provider';
import { HarvestUpdateProvider } from './providers/harvest/update-harvest.provider';
import { TransitUpdateProvider } from './providers/transit/update-transit.provider';
import { AutoConversion } from './entities/auto-conversion.entity';

@Module({
  controllers: [WorksheetController],
  providers: [
    WorksheetService,
    RestockService,
    WorksheetCreateManyProvider,
    WorksheetCreateProvider,
    WorksheetDependentsProvider,
    WorksheetUpdateManyProvider,
    WorksheetHarvestManyProvider,
    WorksheetTasksProvider,
    WorksheetTransitManyProvider,
    GetWorksheetsProvider,
    GetHarvestsProvider,
    GetTransitsProvider,
    WorksheetReportsProvider,
    WorksheetUpdateProvider,
    HarvestUpdateProvider,
    TransitUpdateProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Worksheet,
      Harvest,
      Restock,
      WorksheetHistory,
      Transit,
      MonitoringCount,
      AutoConversion,
    ]),
    UsersModule,
    PaginationModule,
    MasterModule,
  ],
  exports: [WorksheetService],
})
export class WorksheetModule {}

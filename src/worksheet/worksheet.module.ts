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
import { WorksheetHistory } from './entities/worksheet-history.entity';
import { WorksheetUpdateManyProvider } from './providers/worksheet-update-many.provider';
import { WorksheetHarvestManyProvider } from './providers/worksheet-harvest-many.provider';

@Module({
  controllers: [WorksheetController],
  providers: [
    WorksheetService,
    WorksheetCreateManyProvider,
    WorksheetCreateProvider,
    WorksheetDependentsProvider,
    WorksheetUpdateManyProvider,
    WorksheetHarvestManyProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Worksheet, Harvest, Restock, WorksheetHistory]),
    UsersModule,
    PaginationModule,
    MasterModule,
  ],
  exports: [WorksheetService],
})
export class WorksheetModule {}

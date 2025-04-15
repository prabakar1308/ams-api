import { Module } from '@nestjs/common';
import { WorksheetController } from './worksheet.controller';
import { WorksheetService } from './providers/worksheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worksheet } from './entities/worksheet.entity';
import { Harvest } from './entities/harvest.entity';
import { Restock } from './entities/restock.entity';
import { UsersModule } from 'src/users/users.module';
import { WorksheetCreateManyProvider } from './providers/worksheet-create-many.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { WorksheetCreateProvider } from './providers/worksheet-create.provider';

@Module({
  controllers: [WorksheetController],
  providers: [
    WorksheetService,
    WorksheetCreateManyProvider,
    WorksheetCreateProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Worksheet, Harvest, Restock]),
    UsersModule,
    PaginationModule,
  ],
  exports: [WorksheetService],
})
export class WorksheetModule {}

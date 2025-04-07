import { Module } from '@nestjs/common';
import { WorksheetController } from './worksheet.controller';
import { WorksheetService } from './providers/worksheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worksheet } from './entities/worksheet.entity';
import { Harvest } from './entities/harvest.entity';
import { Restock } from './entities/restock.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [WorksheetController],
  providers: [WorksheetService],
  imports: [
    TypeOrmModule.forFeature([Worksheet, Harvest, Restock]),
    UsersModule,
  ],
})
export class WorksheetModule {}

import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './providers/dashboard.service';
import { UsersModule } from 'src/users/users.module';
import { MasterModule } from 'src/master/master.module';
import { WorksheetModule } from 'src/worksheet/worksheet.module';
import { GetWorksheetStatusProvider } from './providers/get-worksheet-status.provider';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, GetWorksheetStatusProvider],
  imports: [UsersModule, MasterModule, WorksheetModule],
})
export class DashboardModule {}

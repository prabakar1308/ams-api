import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './providers/dashboard.service';
import { UsersModule } from 'src/users/users.module';
import { MasterModule } from 'src/master/master.module';
import { WorksheetModule } from 'src/worksheet/worksheet.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [UsersModule, MasterModule, WorksheetModule],
})
export class DashboardModule {}

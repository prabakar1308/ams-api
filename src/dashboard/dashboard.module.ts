import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './providers/dashboard.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [UsersModule],
})
export class DashboardModule {}

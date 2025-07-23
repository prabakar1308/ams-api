import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DashboardService } from './providers/dashboard.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetWorksheetStatusDto } from './dto/get-worksheet-status.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** get active worksheets by tank-wise */
  @ApiOperation({
    summary: 'Get the list of active worksheets tankwise based on the input',
  })
  @Post('active-worksheets')
  public getActiveWorksheets(
    @Body() getWorksheetStatusDto: GetWorksheetStatusDto,
  ) {
    return this.dashboardService.getActiveWorksheets(getWorksheetStatusDto);
  }

  @Get('tank-wise-statuses/:tankTypeId')
  public getTankStatuses(
    @Param('tankTypeId', ParseIntPipe) tankTypeId: number,
  ) {
    return this.dashboardService.getTankWiseStatus(tankTypeId);
  }

  @Get('tank-wise-users/:tankTypeId')
  public getUsersByTankWise(
    @Param('tankTypeId', ParseIntPipe) tankTypeId: number,
  ) {
    return this.dashboardService.getUsersByTankWise(tankTypeId);
  }

  @Get('tank-list-with-status/:tankTypeId')
  public getTankListWithStatus(
    @Param('tankTypeId', ParseIntPipe) tankTypeId: number,
  ) {
    return this.dashboardService.getTankListWithStatus(tankTypeId);
  }
}

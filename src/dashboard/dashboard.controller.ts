import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DashboardService } from './providers/dashboard.service';
import { CreateWorksheetDto } from './dto/create-worksheet.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PatchWorksheetDto } from './dto/patch-worksheet.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** get active worksheets by tank-wise */
  @Get('active-worksheets/:userId')
  public getActiveWorksheets(@Param('userId', ParseIntPipe) userId: number) {
    return this.dashboardService.getActiveWorksheets(userId);
  }

  // TODO: move this to worksheet module later
  @ApiOperation({
    summary: 'Creates a new worksheet and assigned to user',
  })
  @Post('create-worksheet')
  public createWorksheet(@Body() createWorksheetDto: CreateWorksheetDto) {
    console.log(createWorksheetDto);
    return 'Workshett created';
  }

  // TODO: move this to worksheet module later
  @ApiOperation({
    summary: 'Updates a worksheet',
  })
  @Patch('update-worksheet')
  public updateWorksheet(@Body() createWorksheetDto: PatchWorksheetDto) {
    console.log(createWorksheetDto);
    return 'Workshett created';
  }
}

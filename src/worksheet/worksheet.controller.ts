import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateWorksheetDto } from './dto/create-worksheet.dto';
import { PatchWorksheetDto } from './dto/patch-worksheet.dto';
import { WorksheetService } from './providers/worksheet.service';
// import { CreateHarvestDto } from './dto/create-harvest.dto';
import { GetWorksheetsDto } from './dto/get-worksheets.dto';
import { PatchWorksheetsDto } from './dto/patch-worksheets.dto';
import { GetWorksheetHistoryDto } from './dto/get-worksheet-history.dto';
import { CreateHarvestsDto } from './dto/create-harvests.dto';
import { CreateTransitsDto } from './dto/create-transits.dto';
import { RestockService } from './providers/restock/restock.service';
import { GetHarvestsDto } from './dto/get-harvests.dto';
import { GetReportQueryDto } from './dto/get-report-query.dto';
import { PatchHarvestDto } from './dto/patch-harvest.dto';

@Controller('worksheet')
export class WorksheetController {
  constructor(
    private readonly worksheetService: WorksheetService,
    private readonly restockService: RestockService,
  ) {}

  /** Get All Worksheets */
  @ApiOperation({
    summary: 'Get all worksheets',
  })
  @Get('get-all-worksheets')
  public getAllWorksheets() {
    return this.worksheetService.getAllWorksheets();
  }

  @Post('get-active-worksheets')
  public getActiveWorksheet(@Body() body: GetWorksheetsDto) {
    return this.worksheetService.getActiveWorksheets(body);
  }

  @Get('get-worksheets')
  public getWorksheets(@Query() query: GetWorksheetsDto) {
    return this.worksheetService.getWorksheets(query);
  }

  @Get('get-worksheet/:id')
  public getWorksheet(@Param('id', ParseIntPipe) id: number) {
    return this.worksheetService.getCurrentWorksheet(id);
  }

  @Get('get-worksheet-history')
  public getWorksheetHistory(@Query() query: GetWorksheetHistoryDto) {
    return this.worksheetService.getWorksheetHistory(query);
  }

  @Get('get-worksheets-instock-count')
  public getWorksheetsInStockCount(
    @Query('tankTypeId', ParseIntPipe) tankTypeId: number,
  ) {
    return this.worksheetService.getWorksheetsInStockCount(tankTypeId);
  }

  /** Create Worksheet */
  @ApiOperation({
    summary: 'Creates a new worksheet and assigned to user',
  })
  @Post('create-worksheet')
  public createWorksheet(
    @Body() createWorksheetDto: CreateWorksheetDto,
    // @ActiveUser() user: ActiveUserData,
  ) {
    return this.worksheetService.createWorksheet(createWorksheetDto);
  }

  /** Create Worksheets */
  // Use this API for create
  @ApiOperation({
    summary: 'Creates the set of worksheets',
  })
  @Post('create-worksheets')
  public createWorksheets(@Body() createWorksheetsDto: CreateWorksheetDto) {
    return this.worksheetService.createWorksheets(createWorksheetsDto);
  }

  /** Update Worksheet */
  @ApiOperation({
    summary: 'Updates a worksheet',
  })
  @Patch('update-worksheet-params')
  public updateWorksheet(@Body() patchWorksheetDto: PatchWorksheetDto) {
    return this.worksheetService.updateWorksheet(patchWorksheetDto);
  }

  /** Update Multiple Worksheets */
  // Use this API for update
  @ApiOperation({
    summary: 'Updates multiple worksheets',
  })
  @Patch('update-worksheets')
  public updateWorksheets(@Body() patchWorksheetsDto: PatchWorksheetsDto) {
    return this.worksheetService.updateWorksheets(patchWorksheetsDto);
  }

  /** Delete Worksheet */
  @ApiOperation({
    summary: 'Delete a worksheet',
  })
  @Delete('delete-worksheet')
  public deleteWorksheet(@Query('id', ParseIntPipe) id: number) {
    return this.worksheetService.deleteWorksheet(id);
  }

  @ApiOperation({
    summary: 'Soft-Delete a worksheet',
  })
  @Delete('soft-delete-worksheet')
  public softDeleteWorksheet(@Query('id', ParseIntPipe) id: number) {
    return this.worksheetService.softDeleteWorksheet(id);
  }

  @Post('get-worksheet-input-report')
  public getWorksheetInputReport(@Body() body: GetReportQueryDto) {
    return this.worksheetService.getWorksheetInputReport(body);
  }

  @Get('get-active-worksheet-input-report')
  public getActiveWorksheetInputReport() {
    return this.worksheetService.getCurrentInputUnitsReport();
  }

  @Post('get-harvests-count')
  public getHarvestsCount(@Body() body: GetHarvestsDto) {
    return this.worksheetService.getHarvestsCount(body);
  }

  @Post('get-harvests')
  public getHarvests(@Body() body: GetHarvestsDto) {
    return this.worksheetService.getHarvests(body);
  }

  @Get('get-harvest/:id')
  public getHarvest(@Param('id', ParseIntPipe) id: number) {
    return this.worksheetService.getHarvestById(id);
  }

  @Post('update-harvest')
  public updateHarvest(@Body() body: PatchHarvestDto) {
    return this.worksheetService.updateHarvest(body);
  }

  /** Create Harvest */
  // @ApiOperation({
  //   summary: 'Creates a new harvest',
  // })
  // @Post('create-harvest')
  // public createHarvest(@Body() createHarvestDto: CreateHarvestDto) {
  //   return this.worksheetService.createHarvest(createHarvestDto);
  // }

  @ApiOperation({
    summary: 'Creates multiple new harvest',
  })
  @Post('create-multiple-harvest')
  public createHarvests(@Body() createHarvestsDto: CreateHarvestsDto) {
    return this.worksheetService.createWorksheetHarvests(createHarvestsDto);
  }

  @Post('get-transits')
  public getTransits(@Body() body: GetReportQueryDto) {
    return this.worksheetService.getTransits(body);
  }

  @Post('get-transits-count')
  public getTransitsCount(@Body() body: GetReportQueryDto) {
    return this.worksheetService.getTransitCountTotal(body);
  }

  @Post('get-transits-by-unit-sector')
  public getTransitsByUnitSector(@Body() body: GetReportQueryDto) {
    return this.worksheetService.getTransitsByUnitSector(body);
  }

  @ApiOperation({
    summary: 'Creates multiple new transit live',
  })
  @Post('create-multiple-transit')
  public createMultipleTransits(@Body() createTransitsDto: CreateTransitsDto) {
    return this.worksheetService.createMultipleTransits(createTransitsDto);
  }

  // Restock
  @Get('get-restocks')
  public getRestocks(@Query('status') status: string) {
    return this.restockService.getActiveRestocks(status);
  }

  // Restock
  @Get('get-restocks-count')
  public getRestocksCount(@Query('status') status: string) {
    return this.restockService.getTotalCountOfActiveRestocks(status);
  }
}

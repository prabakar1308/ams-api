import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateWorksheetDto } from './dto/create-worksheet.dto';
import { PatchWorksheetDto } from './dto/patch-worksheet.dto';
import { WorksheetService } from './providers/worksheet.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { CreateWorksheetsDto } from './dto/create-worksheets.dto';
import { GetWorksheetsDto } from './dto/get-worksheets.dto';
import { PatchWorksheetsDto } from './dto/patch-worksheets.dto';
import { GetWorksheetHistoryDto } from './dto/get-worksheet-history.dto';
import { CreateHarvestsDto } from './dto/create-harvests.dto';
import { CreateTransitsDto } from './dto/create-transits.dto';

@Controller('worksheet')
export class WorksheetController {
  constructor(private readonly worksheetService: WorksheetService) {}

  /** Get All Worksheets */
  @ApiOperation({
    summary: 'Get all worksheets',
  })
  @Get('get-all-worksheets')
  public getWorksheets() {
    return this.worksheetService.getAllWorksheets();
  }

  @Post('get-active-worksheets')
  public getActiveWorksheet(@Body() body: GetWorksheetsDto) {
    return this.worksheetService.getActiveWorksheets(body);
  }

  @Get('get-worksheets')
  public getWorksheet(@Query() query: GetWorksheetsDto) {
    console.log(query);
    return this.worksheetService.getWorksheets(query);
  }

  @Get('get-worksheet-history')
  public getWorksheetHistory(@Query() query: GetWorksheetHistoryDto) {
    return this.worksheetService.getWorksheetHistory(query);
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
  public createWorksheets(@Body() createWorksheetsDto: CreateWorksheetsDto) {
    return this.worksheetService.createWorksheets(createWorksheetsDto);
  }

  /** Update Worksheet */
  @ApiOperation({
    summary: 'Updates a worksheet',
  })
  @Patch('update-worksheet')
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

  /** Create Harvest */
  @ApiOperation({
    summary: 'Creates a new harvest',
  })
  @Post('create-harvest')
  public createHarvest(@Body() createHarvestDto: CreateHarvestDto) {
    console.log(createHarvestDto);

    return this.worksheetService.createHarvest(createHarvestDto);
  }

  @ApiOperation({
    summary: 'Creates multiple new harvest',
  })
  @Post('create-multiple-harvest')
  public createHarvests(@Body() createHarvestsDto: CreateHarvestsDto) {
    console.log(createHarvestsDto);
    return this.worksheetService.createWorksheetHarvests(createHarvestsDto);
  }

  @ApiOperation({
    summary: 'Creates multiple new transit live',
  })
  @Post('create-multiple-transit')
  public createMultipleTransits(@Body() createTransitsDto: CreateTransitsDto) {
    return this.worksheetService.createMultipleTransits(createTransitsDto);
  }
}

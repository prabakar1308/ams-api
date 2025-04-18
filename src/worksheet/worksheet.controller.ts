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
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

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

  @Get('get-worksheets')
  public getWorksheet(@Query() query: GetWorksheetsDto) {
    console.log(query);
    return this.worksheetService.getWorksheets(query);
  }

  /** Create Worksheet */
  @ApiOperation({
    summary: 'Creates a new worksheet and assigned to user',
  })
  @Post('create-worksheet')
  public createWorksheet(
    @Body() createWorksheetDto: CreateWorksheetDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.worksheetService.createWorksheet(createWorksheetDto, user);
  }

  /** Create Worksheets */
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
}

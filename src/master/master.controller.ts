import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { MasterService } from './providers/master.service';
import { WorksheetStatusService } from './providers/worksheet-status.service';
import { CreateWorksheetStatusDto } from './dto/create-worksheet-status.dto';

@Controller('master')
export class MasterController {
  constructor(
    private readonly masterService: MasterService,
    private readonly worksheetStatusService: WorksheetStatusService,
  ) {}

  @Get('tanks')
  public getTanks(
    @Query('type', new DefaultValuePipe('machinery')) type: string,
  ) {
    return this.masterService.findTanksCount(type);
  }

  @Post('worksheet-status')
  public createWorksheetStatus(
    @Body() createWorksheetStatusDto: CreateWorksheetStatusDto,
  ) {
    return this.worksheetStatusService.createWorksheetStatus(
      createWorksheetStatusDto,
    );
  }
}

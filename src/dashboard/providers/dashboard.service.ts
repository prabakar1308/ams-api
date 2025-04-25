import { Injectable } from '@nestjs/common';
import { GetWorksheetStatusProvider } from './get-worksheet-status.provider';
import { GetWorksheetStatusDto } from '../dto/get-worksheet-status.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly getWorksheetStatusProvider: GetWorksheetStatusProvider,
  ) {}

  public async getActiveWorksheets(
    getWorksheetStatusDto: GetWorksheetStatusDto,
  ) {
    return await this.getWorksheetStatusProvider.getActiveWorksheets(
      getWorksheetStatusDto,
    );
  }
}

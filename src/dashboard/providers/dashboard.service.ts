import { Injectable } from '@nestjs/common';
import { GetWorksheetStatusProvider } from './get-worksheet-status.provider';
import { GetWorksheetStatusDto } from '../dto/get-worksheet-status.dto';
import { GetTankWiseStatusProvider } from './get-tank-wise-status.provider';

@Injectable()
export class DashboardService {
  constructor(
    private readonly getWorksheetStatusProvider: GetWorksheetStatusProvider,
    private readonly getTankWiseStatusProvider: GetTankWiseStatusProvider,
  ) {}

  public async getActiveWorksheets(
    getWorksheetStatusDto: GetWorksheetStatusDto,
  ) {
    return await this.getWorksheetStatusProvider.getActiveWorksheets(
      getWorksheetStatusDto,
    );
  }

  public async getTankWiseStatus(tankTypeId: number) {
    return await this.getTankWiseStatusProvider.getTankWiseStatus(tankTypeId);
  }

  public async getUsersByTankWise(tankTypeId: number) {
    return await this.getTankWiseStatusProvider.getUsersByTankWise(tankTypeId);
  }

  public async getTankListWithStatus(tankTypeId: number) {
    return await this.getTankWiseStatusProvider.getTankListWithStatus(
      tankTypeId,
    );
  }
}

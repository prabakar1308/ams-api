import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { Worksheet } from '../entities/worksheet.entity';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';

@Injectable()
export class WorksheetCreateProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    @InjectRepository(WorksheetHistory)
    private readonly worksheetHistoryRespository: Repository<WorksheetHistory>,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  public async createWorksheet(worksheet: CreateWorksheetDto) {
    const currentUser =
      await this.worksheetDependentsProvider.getWorksheetUser(worksheet);
    const status =
      await this.worksheetDependentsProvider.getWorksheetStatus(worksheet);
    const tankType =
      await this.worksheetDependentsProvider.getWorksheetTankType(worksheet);
    const harvestType =
      await this.worksheetDependentsProvider.getWorksheetHarvestType(worksheet);
    const inputUnit =
      await this.worksheetDependentsProvider.getWorksheetInputUnit(worksheet);

    const newWorksheet = this.worksheetRespository.create({
      ...worksheet,
      user: currentUser || undefined,
      status: status || undefined,
      tankType: tankType || undefined,
      harvestType: harvestType || undefined,
      inputUnit: inputUnit || undefined,
    });

    try {
      const worksheetResult =
        await this.worksheetRespository.save(newWorksheet);
      const newWorksheetHistory = this.worksheetHistoryRespository.create({
        worksheet: worksheetResult,
        action: worksheetHistory.WORKSHEET_CREATED,
      });
      await this.worksheetHistoryRespository.save(newWorksheetHistory);
      return worksheetResult;
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure the worksheet parameters are correct.',
      });
    }
  }
}

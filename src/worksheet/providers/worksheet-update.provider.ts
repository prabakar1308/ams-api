import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';

@Injectable()
export class WorksheetUpdateProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    @InjectRepository(WorksheetHistory)
    private readonly worksheetHistoryRespository: Repository<WorksheetHistory>,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  public async updateWorksheet(
    worksheetDto: PatchWorksheetDto,
  ): Promise<Worksheet> {
    // Fetch the worksheet by ID
    const worksheet = await this.worksheetRespository.findOneBy({
      id: worksheetDto.id,
    });

    if (!worksheet) {
      throw new ConflictException('Worksheet not found');
    }

    const inputUnit =
      await this.worksheetDependentsProvider.getWorksheetInputUnit(
        worksheetDto,
      );

    // Update the worksheet fields

    if (worksheetDto.inputCount !== undefined) {
      worksheet.inputCount = worksheetDto.inputCount;
    }

    if (worksheetDto.harvestTime) {
      worksheet.harvestTime = worksheetDto.harvestTime;
    }

    if (worksheetDto.ph !== undefined) {
      worksheet.ph = worksheetDto.ph;
    }

    if (worksheetDto.salnity !== undefined) {
      worksheet.salnity = worksheetDto.salnity;
    }

    if (worksheetDto.temperature !== undefined) {
      worksheet.temperature = worksheetDto.temperature;
    }

    // Save the updated worksheet
    const updatedWorksheet = await this.worksheetRespository.save({
      ...worksheet,
      inputUnit: inputUnit || worksheet.inputUnit,
    });

    // Log the update in the worksheet history
    await this.worksheetHistoryRespository.save({
      worksheet,
      action: worksheetHistory.WORKSHEET_UPDATED,
      updatedAt: new Date(),
    });

    return updatedWorksheet;
  }
}

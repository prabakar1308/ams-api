import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { Worksheet } from '../entities/worksheet.entity';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';

@Injectable()
export class WorksheetCreateProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  public async createWorksheet(
    worksheet: CreateWorksheetDto,
    user: ActiveUserData,
  ) {
    console.log(user);
    const currentUser =
      await this.worksheetDependentsProvider.getWorksheetUser(worksheet);
    const status =
      await this.worksheetDependentsProvider.getWorksheetStatus(worksheet);
    const tankType =
      await this.worksheetDependentsProvider.getWorksheetTankType(worksheet);
    const harvestType =
      await this.worksheetDependentsProvider.getWorksheetHarvestType(worksheet);

    const newWorksheet = this.worksheetRespository.create({
      ...worksheet,
      user: currentUser,
      status: status || undefined,
      tankType: tankType || undefined,
      harvestType: harvestType || undefined,
    });

    try {
      return await this.worksheetRespository.save(newWorksheet);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure the worksheet parameters are correct.',
      });
    }
  }
}

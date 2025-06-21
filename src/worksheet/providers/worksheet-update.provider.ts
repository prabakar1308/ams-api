import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Worksheet } from '../entities/worksheet.entity';
import { WorksheetDependentsProvider } from './worksheet-dependents.provider';
import { WorksheetHistory } from '../entities/worksheet-history.entity';
import { worksheetHistory } from '../enums/worksheet-history-actions.enum';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
import { Restock } from '../entities/restock.entity';

@Injectable()
export class WorksheetUpdateProvider {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    @InjectRepository(WorksheetHistory)
    private readonly worksheetHistoryRespository: Repository<WorksheetHistory>,
    private readonly worksheetDependentsProvider: WorksheetDependentsProvider,
  ) {}

  // public async updateWorksheet(
  //   worksheetDto: PatchWorksheetDto,
  // ): Promise<Worksheet> {
  //   // Fetch the worksheet by ID
  //   const worksheet = await this.worksheetRespository.findOneBy({
  //     id: worksheetDto.id,
  //   });

  //   const currentValue = JSON.stringify(worksheetDto);

  //   if (!worksheet) {
  //     throw new ConflictException('Worksheet not found');
  //   }

  //   const inputUnit =
  //     await this.worksheetDependentsProvider.getWorksheetInputUnit(
  //       worksheetDto,
  //     );
  //   const harvestType =
  //     await this.worksheetDependentsProvider.getWorksheetHarvestType(
  //       worksheetDto,
  //     );

  //   const currentUser =
  //     await this.worksheetDependentsProvider.getWorksheetUser(worksheetDto);

  //   let restocks: Restock[] = [];

  //   if (worksheetDto.restocks && worksheetDto.restocks.length) {
  //     // Remove all existing restocks from the join table for this worksheet
  //     await this.worksheetRespository
  //       .createQueryBuilder()
  //       .relation(Worksheet, 'restocks')
  //       .of(worksheet.id)
  //       .addAndRemove(
  //         [],
  //         await this.worksheetRespository
  //           .createQueryBuilder()
  //           .relation(Worksheet, 'restocks')
  //           .of(worksheet.id)
  //           .loadMany(),
  //       );
  //   }

  //   if (worksheetDto.restocks && worksheetDto.restocks.length) {
  //     restocks = await this.worksheetDependentsProvider.findMultipleRestocks(
  //       worksheetDto.restocks,
  //     );
  //   }

  //   // Update the worksheet fields

  //   if (worksheetDto.inputCount !== undefined) {
  //     worksheet.inputCount = worksheetDto.inputCount;
  //   }

  //   if (worksheetDto.harvestTime) {
  //     worksheet.harvestTime = worksheetDto.harvestTime;
  //   }

  //   if (worksheetDto.ph !== undefined) {
  //     worksheet.ph = worksheetDto.ph;
  //   }

  //   if (worksheetDto.salnity !== undefined) {
  //     worksheet.salnity = worksheetDto.salnity;
  //   }

  //   if (worksheetDto.temperature !== undefined) {
  //     worksheet.temperature = worksheetDto.temperature;
  //   }

  //   // Save the updated worksheet
  //   const updatedWorksheet = await this.worksheetRespository.save({
  //     ...worksheet,
  //     inputUnit: inputUnit || worksheet.inputUnit,
  //     harvestType: harvestType || worksheet.harvestType,
  //     user: currentUser || worksheet.user,
  //     restocks,
  //   });

  //   // Log the update in the worksheet history
  //   await this.worksheetHistoryRespository.save({
  //     worksheet,
  //     action: worksheetHistory.WORKSHEET_UPDATED,
  //     updatedAt: new Date(),
  //     currentValue,
  //   });

  //   return updatedWorksheet;
  // }

  public async updateWorksheet(
    worksheetDto: PatchWorksheetDto,
  ): Promise<Worksheet> {
    // Start a transaction
    return await this.worksheetRespository.manager.transaction(
      async (manager) => {
        // Fetch the worksheet by ID
        const worksheet = await manager.findOne(Worksheet, {
          where: { id: worksheetDto.id },
        });

        const currentValue = JSON.stringify(worksheetDto);

        if (!worksheet) {
          throw new ConflictException('Worksheet not found');
        }

        const inputUnit =
          await this.worksheetDependentsProvider.getWorksheetInputUnit(
            worksheetDto,
          );
        const harvestType =
          await this.worksheetDependentsProvider.getWorksheetHarvestType(
            worksheetDto,
          );
        const currentUser =
          await this.worksheetDependentsProvider.getWorksheetUser(worksheetDto);

        let restocks: Restock[] = [];

        if (worksheetDto.restocks && worksheetDto.restocks.length) {
          // Load all existing restocks for this worksheet
          const existingRestocks: Restock[] = await manager
            .createQueryBuilder()
            .relation(Worksheet, 'restocks')
            .of(worksheet.id)
            .loadMany();

          // Update status of all existing restocks to 'A'
          for (const restock of existingRestocks) {
            restock.status = 'A';
            await manager.save(Restock, restock);
          }

          // Remove all existing restocks from the join table for this worksheet
          await manager
            .createQueryBuilder()
            .relation(Worksheet, 'restocks')
            .of(worksheet.id)
            .remove(existingRestocks);

          // Find and add the new restocks, and update their status to 'U'
          restocks =
            await this.worksheetDependentsProvider.findMultipleRestocks(
              worksheetDto.restocks,
            );
          for (const restock of restocks) {
            restock.status = 'U';
            await manager.save(Restock, restock);
          }
        }

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
        const updatedWorksheet = await manager.save(Worksheet, {
          ...worksheet,
          inputUnit: inputUnit || worksheet.inputUnit,
          harvestType: harvestType || worksheet.harvestType,
          user: currentUser || worksheet.user,
          restocks,
        });

        // Log the update in the worksheet history
        await manager.save(WorksheetHistory, {
          worksheet,
          action: worksheetHistory.WORKSHEET_UPDATED,
          updatedAt: new Date(),
          currentValue,
        });

        return updatedWorksheet;
      },
    );
  }
}

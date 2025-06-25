import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Restock } from 'src/worksheet/entities/restock.entity';
import { CreateRestockDto } from 'src/worksheet/dto/create-restock.dto';
import { ActiveRestock } from 'src/worksheet/interfaces/restock.interface';
import { WorksheetUnitService } from 'src/master/providers/worksheet-unit.service';
import { WorksheetService } from '../worksheet.service';
import { UsersService } from 'src/users/providers/users.service';
import { getUnitValue } from 'src/worksheet/utils';

@Injectable()
export class RestockService {
  constructor(
    @InjectRepository(Restock)
    private readonly restockRespository: Repository<Restock>,
    private readonly unitService: WorksheetUnitService,
    @Inject(forwardRef(() => WorksheetService))
    private readonly worksheetService: WorksheetService,
    private readonly userService: UsersService,
  ) {}

  // For Dashboard Count
  public async getTotalCountOfActiveRestocks(status: string): Promise<number> {
    // Fetch active restocks based on the status filter
    const restocks = await this.restockRespository.find({
      where: { status },
    });

    // Calculate the total value of count
    const totalCount = restocks.reduce(
      (sum, restock) => sum + (restock.count || 0),
      0,
    );

    return totalCount;
  }

  public async getWorksheetIdByRestockId(
    restockId: number,
  ): Promise<number | null> {
    // Assuming the join table is named 'worksheet_restocks_restock' and columns are 'worksheetId' and 'restockId'
    const result: { worksheetId: number | null } | undefined =
      await this.restockRespository.manager
        .createQueryBuilder()
        .select('worksheet_restocks_restock."worksheetId"', 'worksheetId')
        .from('worksheet_restocks_restock', 'worksheet_restocks_restock')
        .where('worksheet_restocks_restock."restockId" = :restockId', {
          restockId,
        })
        .getRawOne();

    return result ? result.worksheetId : null;
  }

  public async getActiveRestocks(status: string): Promise<ActiveRestock[]> {
    // Support comma-separated status values
    const statusList = status.split(',').map((s) => s.trim());

    const restocks = await this.restockRespository.find({
      where:
        statusList.length > 1
          ? statusList.map((s) => ({ status: s }))
          : { status: statusList[0] },
    });

    // Use Promise.all to resolve all asynchronous operations
    return await Promise.all(
      restocks.map(async (restock) => {
        const {
          worksheet,
          harvest,
          status,
          unit,
          count,
          id,
          createdBy,
          createdAt,
        } = restock;

        const userName = await this.userService.getUserNameById(createdBy);
        const worksheetId = await this.getWorksheetIdByRestockId(id);
        console.log(worksheetId, id, 'worksheetId');
        return {
          id,
          createdAt,
          createdBy: userName,
          status,
          count,
          unit: unit ? unit.value : '',
          unitId: unit ? unit.id : 0,
          harvest: harvest
            ? `${harvest.count} ${getUnitValue(harvest.unit)}`
            : '',
          // worksheet id of where this stock is mapped as harvest type
          worksheetId: worksheetId || undefined,
          // Details of worksheet where this restock is created
          worksheet: {
            tankType: worksheet ? worksheet.tankType.value : '',
            tankNumber: worksheet ? worksheet.tankNumber : 0,
            harvestType: worksheet ? worksheet.harvestType.value : '',
            inputValue: worksheet
              ? `${worksheet.inputCount} ${getUnitValue(worksheet.inputUnit)}`
              : '',
          },
        };
      }),
    );
  }

  public async getRestockWorksheet(worksheetId: number) {
    let worksheet: Restock['worksheet'] | null = null;
    if (worksheetId) {
      const fetchedWorksheet =
        await this.worksheetService.getWorksheetById(worksheetId);

      if (!fetchedWorksheet) {
        throw new Error('Worksheet Id not found');
      }

      worksheet = fetchedWorksheet;
    }

    return worksheet;
  }

  public async getRestockUnit(unitId: number) {
    let unit: Restock['unit'] | null = null;
    if (unitId) {
      const fetchedUnit = await this.unitService.getWorksheetUnitById(unitId);

      if (!fetchedUnit) {
        throw new Error('Unit Id not found');
      }

      unit = fetchedUnit;
    }

    return unit;
  }

  public async createRestock(restock: CreateRestockDto) {
    const unit = await this.getRestockUnit(restock.unitId);
    const worksheet = await this.getRestockWorksheet(restock.worksheetId);
    const newRestock = this.restockRespository.create({
      ...restock,
      unit: unit || undefined,
      worksheet: worksheet || undefined,
    });
    return await this.restockRespository.save(newRestock);
  }
}

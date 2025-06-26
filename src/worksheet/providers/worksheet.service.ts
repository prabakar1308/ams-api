import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { PatchWorksheetsDto } from '../dto/patch-worksheets.dto';
import { GetWorksheetsDto } from '../dto/get-worksheets.dto';
import { GetWorksheetHistoryDto } from '../dto/get-worksheet-history.dto';
import { CreateTransitsDto } from '../dto/create-transits.dto';
import { CreateHarvestsDto } from '../dto/create-harvests.dto';

import { Worksheet } from '../entities/worksheet.entity';
import { WorksheetHistory } from '../entities/worksheet-history.entity';

import { GetWorksheetsProvider } from './get-worksheets.provider';
import { WorksheetCreateProvider } from './worksheet-create.provider';
import { WorksheetCreateManyProvider } from './worksheet-create-many.provider';
import { WorksheetUpdateManyProvider } from './worksheet-update-many.provider';
import { WorksheetHarvestManyProvider } from './harvest/worksheet-harvest-many.provider';
import { WorksheetTransitManyProvider } from './transit/worksheet-transit-many.provider';

import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { GetHarvestsDto } from '../dto/get-harvests.dto';
import { GetHarvestsProvider } from './harvest/get-harvests.provider';
import { GetReportQueryDto } from '../dto/get-report-query.dto';
import { GetTransitsProvider } from './transit/get-transits.provider';
import { WorksheetReportsProvider } from './worksheet-reports.provider';
import { WorksheetUpdateProvider } from './worksheet-update.provider';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
import { UpdateWorksheet } from '../interfaces/update-worksheet.interface';
import { PatchHarvestDto } from '../dto/patch-harvest.dto';
import { HarvestUpdateProvider } from './harvest/update-harvest.provider';
import { PatchTransitDto } from '../dto/patch-transit.dto';
import { TransitUpdateProvider } from './transit/update-transit.provider';

@Injectable()
export class WorksheetService {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    @InjectRepository(WorksheetHistory)
    private readonly worksheetHistoryRespository: Repository<WorksheetHistory>,
    private readonly worksheetCreatManyProvider: WorksheetCreateManyProvider,
    private readonly worksheetUpdateManyProvider: WorksheetUpdateManyProvider,
    private readonly worksheetCreatProvider: WorksheetCreateProvider,
    private readonly paginationProvider: PaginationProvider,
    private readonly worksheetUpdateProvider: WorksheetUpdateProvider,
    private readonly worksheetHarvestManyProvider: WorksheetHarvestManyProvider,
    private readonly worksheetTransitManyProvider: WorksheetTransitManyProvider,
    private readonly getWorksheetsProvider: GetWorksheetsProvider,
    private readonly getHarvestsProvider: GetHarvestsProvider,
    private readonly getTransitsProvider: GetTransitsProvider,
    private readonly worksheetReportsProvider: WorksheetReportsProvider,
    private readonly harvestUpdateProvider: HarvestUpdateProvider,
    private readonly transitUpdateProvider: TransitUpdateProvider,
  ) {}

  public async getWorksheets(
    query: GetWorksheetsDto,
  ): Promise<Paginated<Worksheet>> {
    return await this.paginationProvider.paginateQuery<Worksheet>(
      {
        limit: query.limit,
        page: query.page,
      },
      this.worksheetRespository,
    );
    // return await this.worksheetRespository.find({
    //   relations: {
    //     user: true, //use this or eager inside entity to include user details
    //   },
    //   skip: ((query.page ?? 1) - 1) * (query.limit ?? 10),
    //   take: query.limit,
    // });
  }

  public async getWorksheetsInStockCount(tankTypeId: number) {
    return await this.getWorksheetsProvider.getWorksheetsInStockingGroupedByInputUnit(
      tankTypeId,
    );
  }

  public async getActiveWorksheets(getWorksheetStatusDto: GetWorksheetsDto) {
    return await this.getWorksheetsProvider.getActiveWorksheets(
      getWorksheetStatusDto,
    );
  }

  public async getActiveWorksheetsByTankType(tankTypeId: number) {
    return await this.getWorksheetsProvider.getActiveWorksheetsByTankType(
      tankTypeId,
    );
  }

  public async getWorksheetHistory(
    query: GetWorksheetHistoryDto,
  ): Promise<WorksheetHistory[]> {
    return await this.worksheetHistoryRespository.findBy({
      worksheet: {
        id: query.worksheetId,
      },
    });
  }

  public async getAllWorksheets(): Promise<Worksheet[]> {
    return await this.worksheetRespository.find();
    // return await this.worksheetRespository.find({
    //   relations: {
    //     user: true, //use this or eager inside entity to include user details
    //   },
    //   skip: ((query.page ?? 1) - 1) * (query.limit ?? 10),
    //   take: query.limit,
    // });
  }

  public async getCurrentWorksheet(
    id: number,
  ): Promise<UpdateWorksheet | null> {
    const worksheet = await this.worksheetRespository.findOne({
      where: { id },
      relations: ['restocks'],
    });

    if (worksheet) {
      return {
        id: worksheet?.id,
        harvestHours: worksheet.harvestHours,
        harvestTypeId: worksheet.harvestType.id,
        inputCount: worksheet.inputCount,
        inputUnitId: worksheet.inputUnit.id,
        ph: worksheet.ph,
        salnity: worksheet.salnity,
        temperature: worksheet.temperature,
        userId: worksheet.user.id,
        tankNumber: worksheet.tankNumber,
        tankTypeId: worksheet.tankType.id,
        restocks: worksheet.restocks.map((restock) => restock.id),
      };
    }
    return null;
  }

  public async getWorksheetById(id: number): Promise<Worksheet | null> {
    return await this.worksheetRespository.findOneBy({ id });
  }

  public async createWorksheet(worksheet: CreateWorksheetDto) {
    return await this.worksheetCreatProvider.createWorksheet(worksheet);
  }

  public async createWorksheets(worksheets: CreateWorksheetDto) {
    await this.worksheetCreatManyProvider.createWorksheets(worksheets);
    return await this.getActiveWorksheets({
      tankTypeId: worksheets.tankTypeId,
      userId: 0,
      statusId: 0,
    });
  }

  // public async updateWorksheet(patchWorksheetDto: PatchWorksheetDto) {
  //   const worksheet = await this.worksheetRespository.findOneBy({
  //     id: patchWorksheetDto.id,
  //   });
  //   if (!worksheet) {
  //     throw new Error('Worksheet not found');
  //   }

  //   let status: Worksheet['status'] = worksheet.status;
  //   if (patchWorksheetDto.statusId) {
  //     // check if statusId is valid
  //     const fetchedStatus =
  //       await this.worksheetStatusService.getWorksheetStatusById(
  //         patchWorksheetDto.statusId,
  //       );

  //     if (!fetchedStatus) {
  //       throw new Error('Worksheet Status not found');
  //     }

  //     status = fetchedStatus;
  //   }

  //   worksheet.status = status;

  //   return await this.worksheetRespository.save(worksheet);
  // }

  public async updateWorksheet(patchWorksheetDto: PatchWorksheetDto) {
    await this.worksheetUpdateProvider.updateWorksheet(patchWorksheetDto);
    return await this.getActiveWorksheets(
      patchWorksheetDto.worksheetFilter ?? {},
    );
  }

  public async updateWorksheets(patchWorksheetsDto: PatchWorksheetsDto) {
    await this.worksheetUpdateManyProvider.updateWorksheets(patchWorksheetsDto);
    return await this.getActiveWorksheets(
      patchWorksheetsDto.worksheetFilter ?? {},
    );
  }

  public async deleteWorksheet(id: number) {
    const worksheet = await this.worksheetRespository.findOneBy({
      id,
    });
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    return await this.worksheetRespository.delete(id);
  }

  public async softDeleteWorksheet(id: number) {
    const worksheet = await this.worksheetRespository.findOneBy({
      id,
    });
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    return await this.worksheetRespository.softDelete(id);
  }

  public async getHarvestsCount(getHarvestsDto: GetHarvestsDto) {
    return await this.getHarvestsProvider.getTotalCountInStockOfActiveHarvests(
      getHarvestsDto,
    );
  }

  public async getHarvests(getHarvestsDto: GetHarvestsDto) {
    return await this.getHarvestsProvider.getActiveHarvests(getHarvestsDto);
  }

  public async getHarvestById(id: number) {
    return await this.getHarvestsProvider.getHarvestById(id);
  }

  public async updateHarvest(patchHarvestDto: PatchHarvestDto) {
    return await this.harvestUpdateProvider.updateHarvest(patchHarvestDto);
  }

  // public async createHarvest(harvest: CreateHarvestDto) {
  //   let response = {};
  //   const newHarvest = this.harvestRespository.create(harvest);
  //   const harvestResponse = await this.harvestRespository.save(newHarvest);
  //   response = { ...response, harvest: harvestResponse };
  //   // If restock count is greater than 0, create a new restock entry
  //   if (harvest.restockCount > 0) {
  //     const restock = new CreateRestockDto();
  //     restock.worksheetId = newHarvest.worksheetId;
  //     restock.harvestId = harvestResponse.id;
  //     restock.count = harvest.restockCount;
  //     restock.unitId = harvest.restockUnitId;
  //     const restockResponse = await this.restockService.createRestock(restock);
  //     response = { ...response, restock: restockResponse };
  //   }

  //   await this.updateWorksheet({
  //     id: harvest.worksheetId,
  //     statusId: harvest.statusId,
  //   });

  //   return response;
  // }

  public async createWorksheetHarvests(createHarvestsDto: CreateHarvestsDto) {
    return await this.worksheetHarvestManyProvider.createWorksheetHarvests(
      createHarvestsDto,
    );
  }

  public async getTransits(getTransitsReportDto: GetReportQueryDto) {
    return await this.getTransitsProvider.getCurrentTransits(
      getTransitsReportDto,
    );
  }

  public async getTransitCountTotal(getTransitsReportDto: GetReportQueryDto) {
    return await this.getTransitsProvider.getTransitsTotalCount(
      getTransitsReportDto,
    );
  }

  public async getTransitsByUnitSector(
    getTransitsReportDto: GetReportQueryDto,
  ) {
    return await this.getTransitsProvider.getTransitsGroupedByUnitSectorAndShift(
      getTransitsReportDto,
    );
  }

  public async createMultipleTransits(createTransitsDto: CreateTransitsDto) {
    return await this.worksheetTransitManyProvider.createMultipleTransits(
      createTransitsDto,
    );
  }

  public async updateTransit(PatchTransitDto: PatchTransitDto) {
    return await this.transitUpdateProvider.updateTransit(PatchTransitDto);
  }

  public async getWorksheetInputReport(
    getTransitsReportDto: GetReportQueryDto,
  ) {
    return await this.worksheetReportsProvider.getInputUnitsReport(
      getTransitsReportDto,
    );
  }

  public async getCurrentInputUnitsReport() {
    return await this.worksheetReportsProvider.getCurrentInputUnitsReport();
  }
}

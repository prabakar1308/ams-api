import { Injectable } from '@nestjs/common';
import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { DataSource, Repository } from 'typeorm';
import { Worksheet } from '../entities/worksheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { Harvest } from '../entities/harvest.entity';
import { CreateRestockDto } from '../dto/create-restock.dto';
import { Restock } from '../entities/restock.entity';
import { UsersService } from 'src/users/providers/users.service';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';
import { ConfigService } from '@nestjs/config';
import { WorksheetCreateManyProvider } from './worksheet-create-many.provider';
import { CreateWorksheetsDto } from '../dto/create-worksheets.dto';
import { GetWorksheetsDto } from '../dto/get-worksheets.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { WorksheetCreateProvider } from './worksheet-create.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class WorksheetService {
  constructor(
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
    @InjectRepository(Harvest)
    private readonly harvestRespository: Repository<Harvest>,
    @InjectRepository(Restock)
    private readonly restockRespository: Repository<Restock>,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    // inject datasource
    private readonly datasource: DataSource,
    private readonly worksheetCreatManyProvider: WorksheetCreateManyProvider,
    private readonly worksheetCreatProvider: WorksheetCreateProvider,
    private readonly paginationProvider: PaginationProvider,
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

  public async createWorksheet(
    worksheet: CreateWorksheetDto,
    user: ActiveUserData,
  ) {
    return await this.worksheetCreatProvider.createWorksheet(worksheet, user);
  }

  public async createWorksheets(worksheets: CreateWorksheetsDto) {
    return await this.worksheetCreatManyProvider.createWorksheets(worksheets);
  }

  public async updateWorksheet(patchWorksheetDto: PatchWorksheetDto) {
    const worksheet = await this.worksheetRespository.findOneBy({
      id: patchWorksheetDto.id,
    });

    // update properities
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    worksheet.statusId = patchWorksheetDto.statusId ?? worksheet.statusId;

    return await this.worksheetRespository.save(worksheet);
  }

  public async deleteWorksheet(id: number) {
    const worksheet = await this.worksheetRespository.findOneBy({
      id,
    });
    console.log(worksheet);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    return await this.worksheetRespository.delete(id);
  }

  public async softDeleteWorksheet(id: number) {
    const worksheet = await this.worksheetRespository.findOneBy({
      id,
    });
    console.log(worksheet);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    return await this.worksheetRespository.softDelete(id);
  }

  public async createHarvest(harvest: CreateHarvestDto) {
    let response = {};
    const newHarvest = this.harvestRespository.create(harvest);
    const harvestResponse = await this.harvestRespository.save(newHarvest);
    response = { ...response, harvest: harvestResponse };
    console.log(harvestResponse);
    // If restock count is greater than 0, create a new restock entry
    if (harvest.restockCount > 0) {
      const restock = new CreateRestockDto();
      restock.worksheetId = newHarvest.worksheetId;
      restock.harvestId = harvestResponse.id;
      restock.count = harvest.restockCount;
      restock.unitName = harvest.restockUnit;
      const restockResponse = await this.createRestock(restock);
      response = { ...response, restock: restockResponse };
    }

    await this.updateWorksheet({
      id: harvest.worksheetId,
      statusId: harvest.statusId,
    });

    return response;
  }

  public async createRestock(restock: CreateRestockDto) {
    const newRestock = this.restockRespository.create(restock);
    return await this.restockRespository.save(newRestock);
  }
}

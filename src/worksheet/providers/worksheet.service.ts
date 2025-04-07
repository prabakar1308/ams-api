import { Injectable } from '@nestjs/common';
import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { Repository } from 'typeorm';
import { Worksheet } from '../entities/worksheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { Harvest } from '../entities/harvest.entity';
import { CreateRestockDto } from '../dto/create-restock.dto';
import { Restock } from '../entities/restock.entity';
import { UsersService } from 'src/users/providers/users.service';
import { PatchWorksheetDto } from '../dto/patch-worksheet.dto';

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
  ) {}

  public async getWorksheets() {
    return await this.worksheetRespository.find({
      relations: {
        user: true, //use this or eager inside entity to include user details
      },
    });
  }

  public async createWorksheet(worksheet: CreateWorksheetDto) {
    const user = await this.userService.findOneById(worksheet.userId);
    const newWorksheet = this.worksheetRespository.create({
      ...worksheet,
      user: user,
    });
    return await this.worksheetRespository.save(newWorksheet);
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

    return response;
  }

  public async createRestock(restock: CreateRestockDto) {
    const newRestock = this.restockRespository.create(restock);
    return await this.restockRespository.save(newRestock);
  }
}

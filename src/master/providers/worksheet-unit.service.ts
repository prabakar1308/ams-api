import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { WorksheetUnit } from '../entities/worksheet-unit.entity';
import { CreateWorksheetUnitDto } from '../dto/create-worksheet-unit.dto';
import { PatchWorksheetUnitDto } from '../dto/patch-worksheet-unit.dto';

@Injectable()
export class WorksheetUnitService {
  constructor(
    @InjectRepository(WorksheetUnit)
    private readonly worksheetUnitRepository: Repository<WorksheetUnit>,
  ) {}

  public async getWorksheetUnits() {
    return await this.worksheetUnitRepository.find();
  }

  public async getWorksheetUnitById(id: number) {
    return await this.worksheetUnitRepository.findOneBy({ id });
  }

  public async createWorksheetUnit(
    createWorksheetUnitDto: CreateWorksheetUnitDto,
  ) {
    const unit = this.worksheetUnitRepository.create(createWorksheetUnitDto);
    return await this.worksheetUnitRepository.save(unit);
  }

  public async updateWorksheetUnit(
    PatchWorksheetUnitDto: PatchWorksheetUnitDto,
  ) {
    const unit = this.worksheetUnitRepository.create(PatchWorksheetUnitDto);
    return await this.worksheetUnitRepository.save(unit);
  }
}

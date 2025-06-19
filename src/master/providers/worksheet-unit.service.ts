import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { WorksheetUnit } from '../entities/worksheet-unit.entity';

@Injectable()
export class WorksheetUnitService {
  constructor(
    @InjectRepository(WorksheetUnit)
    private readonly unitRepository: Repository<WorksheetUnit>,
  ) {}

  public async getWorksheetUnits() {
    return await this.unitRepository.find();
  }

  public async getWorksheetUnitById(id: number) {
    return await this.unitRepository.findOneBy({ id });
  }
}

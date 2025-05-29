import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HarvestUnit } from '../entities/harvest-unit.entity';

@Injectable()
export class HarvestUnitService {
  constructor(
    @InjectRepository(HarvestUnit)
    private readonly unitRepository: Repository<HarvestUnit>,
  ) { }

  public async getHarvestUnits() {
    return await this.unitRepository.find();
  }

  public async getHarvestUnitById(id: number) {
    return await this.unitRepository.findOneBy({ id });
  }
}

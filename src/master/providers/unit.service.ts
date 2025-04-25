import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Unit } from '../entities/unit.entity';
import { PatchUnitDto } from '../dto/patch-unit.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}
  public async createUnit(createUnitDto: CreateUnitDto) {
    const unit = this.unitRepository.create(createUnitDto);
    return await this.unitRepository.save(unit);
  }

  public async updateUnit(patchUnitDto: PatchUnitDto) {
    const unit = this.unitRepository.create(patchUnitDto);
    return await this.unitRepository.save(unit);
  }

  public async getUnits() {
    return await this.unitRepository.find();
  }

  public async getUnitById(id: number) {
    return await this.unitRepository.findOneBy({ id });
  }
}

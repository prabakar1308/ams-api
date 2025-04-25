import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UnitSector } from '../entities/unit-sector.entity';
import { CreateUnitSectorDto } from '../dto/create-unit-sector.dto';
import { PatchUnitSectorDto } from '../dto/patch-unit-sector.dto';

@Injectable()
export class UnitSectorService {
  constructor(
    @InjectRepository(UnitSector)
    private readonly unitSectorRepository: Repository<UnitSector>,
  ) {}
  public async createUnitSector(createUnitSectorDto: CreateUnitSectorDto) {
    const unitSector = this.unitSectorRepository.create(createUnitSectorDto);
    return await this.unitSectorRepository.save(unitSector);
  }

  public async updateUnitSector(patchUnitSectorDto: PatchUnitSectorDto) {
    const unitSector = this.unitSectorRepository.create(patchUnitSectorDto);
    return await this.unitSectorRepository.save(unitSector);
  }

  public async getUnitSectors() {
    return await this.unitSectorRepository.find();
  }

  public async getUnitSectorById(id: number) {
    return await this.unitSectorRepository.findOneBy({ id });
  }
}

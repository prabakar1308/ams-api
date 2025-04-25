import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HarvestType } from '../entities/harvest-type.entity';
import { PatchHarvestTypeDto } from '../dto/patch-harvest-type.dto';

@Injectable()
export class HarvestTypeService {
  constructor(
    @InjectRepository(HarvestType)
    private readonly harvestTypeRepository: Repository<HarvestType>,
  ) {}
  public async updateHarvestType(patchHarvestTypeDto: PatchHarvestTypeDto) {
    const harvestType = this.harvestTypeRepository.create(patchHarvestTypeDto);
    return await this.harvestTypeRepository.save(harvestType);
  }

  public async getHarvestTypes() {
    return await this.harvestTypeRepository.find();
  }

  public async getHarvestTypeById(id: number) {
    return await this.harvestTypeRepository.findOneBy({ id });
  }
}

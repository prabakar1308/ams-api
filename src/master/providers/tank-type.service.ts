import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TankType } from '../entities/tank-type.entity';
import { PatchTankTypeDto } from '../dto/patch-tank-type.dto';

@Injectable()
export class TankTypeService {
  constructor(
    @InjectRepository(TankType)
    private readonly tankTypeRepository: Repository<TankType>,
  ) {}
  public async updateTankType(patchTankTypeDto: PatchTankTypeDto) {
    const tankType = this.tankTypeRepository.create(patchTankTypeDto);
    return await this.tankTypeRepository.save(tankType);
  }

  public async getTankTypes() {
    return await this.tankTypeRepository.find();
  }

  public async getTankTypesById(id: number) {
    return await this.tankTypeRepository.findOneBy({ id });
  }
}

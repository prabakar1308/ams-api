import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PatchRangeGenericDto } from '../dto/patch-range-generic.dto';
import { Tank } from '../entities/tank.entity';

@Injectable()
export class TankService {
  constructor(
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
  ) {}
  public async updateTank(patchTankDto: PatchRangeGenericDto) {
    const tank = this.tankRepository.create(patchTankDto);
    return await this.tankRepository.save(tank);
  }

  public async getTankDetails() {
    const tankDetails = (await this.tankRepository.find({ take: 1 }))[0];
    return tankDetails || { min: 1, max: 25 };
  }

  public async getTankDetailsById(id: number) {
    return await this.tankRepository.findOneBy({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PatchRangeGenericDto } from '../dto/patch-range-generic.dto';
import { Temperature } from '../entities/temperature.entity';

@Injectable()
export class TemperatureService {
  constructor(
    @InjectRepository(Temperature)
    private readonly tempRepository: Repository<Temperature>,
  ) {}
  public async updateTemperature(patchTempDto: PatchRangeGenericDto) {
    const temp = this.tempRepository.create(patchTempDto);
    return await this.tempRepository.save(temp);
  }

  public async getTemperature() {
    return await this.tempRepository.find();
  }

  public async getTemperatureById(id: number) {
    return await this.tempRepository.findOneBy({ id });
  }
}

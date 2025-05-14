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
    const response = await this.tempRepository.find();
    return response
      .map((ph) => ({
        ...ph,
        unitName: ph.unit?.value,
        unit: undefined,
      }))
      .at(0);
  }

  public async getTemperatureById(id: number) {
    return await this.tempRepository.findOneBy({ id });
  }
}

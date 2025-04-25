import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PatchRangeGenericDto } from '../dto/patch-range-generic.dto';
import { Salnity } from '../entities/salnity.entity';

@Injectable()
export class SalnityService {
  constructor(
    @InjectRepository(Salnity)
    private readonly salnityRepository: Repository<Salnity>,
  ) {}
  public async updateSalnity(patchSalnityDto: PatchRangeGenericDto) {
    const salnity = this.salnityRepository.create(patchSalnityDto);
    return await this.salnityRepository.save(salnity);
  }

  public async getSalnity() {
    return await this.salnityRepository.find();
  }

  public async getSalnityById(id: number) {
    return await this.salnityRepository.findOneBy({ id });
  }
}

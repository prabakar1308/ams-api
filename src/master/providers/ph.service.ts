import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ph } from '../entities/ph.entity';
import { PatchRangeGenericDto } from '../dto/patch-range-generic.dto';

@Injectable()
export class PHService {
  constructor(
    @InjectRepository(Ph)
    private readonly phRepository: Repository<Ph>,
  ) {}
  public async updatePH(patchPHDto: PatchRangeGenericDto) {
    const ph = this.phRepository.create(patchPHDto);
    return await this.phRepository.save(ph);
  }

  public async getPH() {
    return (await this.phRepository.find()).at(0);
  }

  public async getPHById(id: number) {
    return await this.phRepository.findOneBy({ id });
  }
}

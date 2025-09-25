import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SourceTracker } from '../entities/source-tracker.entity';
import { CreateSourceTrackerDto } from '../dto/create-source-tracker.dto';
import { PatchSourceTrackerDto } from '../dto/patch-source-tracker.dto';

@Injectable()
export class SourceTrackerService {
  constructor(
    @InjectRepository(SourceTracker)
    private readonly sourceTrackerRepository: Repository<SourceTracker>,
  ) {}

  async create(createDto: CreateSourceTrackerDto): Promise<SourceTracker> {
    const entity = this.sourceTrackerRepository.create(createDto);
    return this.sourceTrackerRepository.save(entity);
  }

  public async getSourceTrackerDetails() {
    return this.sourceTrackerRepository.find();
  }
  public async getSourceTrackerById(id: number) {
    return await this.sourceTrackerRepository.findOneBy({ id });
  }

  public async createSourceTracker(
    createSourceTrackerDto: CreateSourceTrackerDto,
  ) {
    const unit = this.sourceTrackerRepository.create(createSourceTrackerDto);
    return await this.sourceTrackerRepository.save(unit);
  }

  public async updateSourceTracker(
    pactchSourceTrackerDto: PatchSourceTrackerDto,
  ) {
    const unit = this.sourceTrackerRepository.create(pactchSourceTrackerDto);
    return await this.sourceTrackerRepository.save(unit);
  }

  public async deleteSourceTracker(id: number) {
    return await this.sourceTrackerRepository.softDelete(id);
  }
  public async getSourceTrackerList(
    fromDate: Date,
    toDate: Date,
  ): Promise<SourceTracker[]> {
    return await this.sourceTrackerRepository.find({
      where: {
        generatedAt: Between(fromDate, toDate),
      },
    });
  }
}

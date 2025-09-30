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
    const result = await this.sourceTrackerRepository
      .createQueryBuilder('sourceTracker')
      .select('sourceTracker.unitSource', 'unitSource')
      .addSelect('SUM(sourceTracker.count)', 'totalCount')
      .groupBy('sourceTracker.unitSource')
      // .orderBy('totalCount', 'DESC') // Optional: Order by total count in descending order
      .getRawMany<{ unitSource: number; totalCount: string }>();

    const count = result.map((row) => ({
      unitSource: row.unitSource,
      totalCount: Number(row.totalCount),
    }));
    return count;
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
  ): Promise<{
    list: SourceTracker[];
    count: { unitSource: number; totalCount: number }[];
  }> {
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    const list = await this.sourceTrackerRepository.find({
      where: {
        generatedAt: Between(start, end),
      },
      order: {
        generatedAt: 'DESC',
      },
    });
    const result = await this.sourceTrackerRepository
      .createQueryBuilder('sourceTracker')
      .select('sourceTracker.unitSource', 'unitSource')
      .addSelect('SUM(sourceTracker.count)', 'totalCount')
      .where('sourceTracker.generatedAt BETWEEN :start AND :end', {
        start,
        end,
      })
      .groupBy('sourceTracker.unitSource')
      // .orderBy('totalCount', 'DESC') // Optional: Order by total count in descending order
      .getRawMany<{ unitSource: number; totalCount: string }>();

    const count = result.map((row) => ({
      unitSource: row.unitSource,
      totalCount: Number(row.totalCount),
    }));
    return { list, count };
  }
}

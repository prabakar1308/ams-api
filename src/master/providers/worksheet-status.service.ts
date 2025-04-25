import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PatchGenericDto } from '../dto/patch-base-generic.dto';
import { WorksheetStatus } from '../entities/worksheet-status.entity';

@Injectable()
export class WorksheetStatusService {
  constructor(
    @InjectRepository(WorksheetStatus)
    private readonly worksheetStatusRepository: Repository<WorksheetStatus>,
  ) {}
  public async updateWorksheetStatus(patchWorksheetStatusDto: PatchGenericDto) {
    const worksheetStatus = this.worksheetStatusRepository.create(
      patchWorksheetStatusDto,
    );
    return await this.worksheetStatusRepository.save(worksheetStatus);
  }

  public async getWorksheetStatus() {
    return await this.worksheetStatusRepository.find();
  }

  public async getWorksheetStatusById(id: number) {
    return await this.worksheetStatusRepository.findOneBy({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { WorksheetStatus } from '../entities/worksheet-status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorksheetStatusDto } from '../dto/create-worksheet-status.dto';

@Injectable()
export class WorksheetStatusService {
  constructor(
    @InjectRepository(WorksheetStatus)
    private readonly worksheetStatusRepository: Repository<WorksheetStatus>,
  ) {}
  public async createWorksheetStatus(
    createWorksheetStatusDto: CreateWorksheetStatusDto,
  ) {
    const worksheetStatus = this.worksheetStatusRepository.create(
      createWorksheetStatusDto,
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

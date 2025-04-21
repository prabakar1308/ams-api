import { Injectable } from '@nestjs/common';
import { CreateTankDto } from '../dto/create-tank.dto';
import { Tank } from '../entities/tank.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TankType } from '../entities/tank-type.entity';
import { HarvestType } from '../entities/harvest-type.entity';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
    @InjectRepository(TankType)
    private readonly tankTypeRepository: Repository<TankType>,
    @InjectRepository(HarvestType)
    private readonly harvestTypeRepository: Repository<HarvestType>,
  ) {}

  /** Tanks */
  public async createTanks(createTankDto: CreateTankDto) {
    const tanks = this.tankRepository.create(createTankDto);
    return await this.tankRepository.save(tanks);
  }

  public async getTankDetails() {
    //
    return await this.tankRepository.findOneBy({ id: 1 });
  }

  public findTanksCount(type: string) {
    console.log(type);
    return 25;
  }

  /** Tank Type */
  public async getWorksheetTankTypeById(id: number) {
    return await this.tankTypeRepository.findOneBy({ id });
  }

  /** Harvest Type */
  public async getWorksheetHarvestTypeById(id: number) {
    return await this.harvestTypeRepository.findOneBy({ id });
  }
}

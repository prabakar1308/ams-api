import { Injectable } from '@nestjs/common';
import { CreateTankDto } from '../dto/create-tank.dto';
import { Tank } from '../entities/tank.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
  ) {}

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
}

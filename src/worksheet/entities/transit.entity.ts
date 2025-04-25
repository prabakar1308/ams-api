import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Harvest } from './harvest.entity';
import { UnitSector } from 'src/master/entities/unit-sector.entity';
import { Unit } from 'src/master/entities/unit.entity';

@Entity({ schema: 'worksheet' })
export class Transit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Harvest, (harvest) => harvest.id, { eager: true })
  @JoinColumn({ name: 'harvestId' })
  harvestId: number;

  @ManyToOne(() => UnitSector, (unitSector) => unitSector.id, { eager: true })
  @JoinColumn({ name: 'unitSectorId' })
  unitSectorId: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  count: number;

  @ManyToOne(() => Unit, (unit) => unit.id, { eager: true })
  @JoinColumn({ name: 'unitId' })
  unitId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

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
import { WorksheetUnit } from 'src/master/entities/worksheet-unit';

@Entity({ schema: 'worksheet' })
export class Transit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Harvest, (harvest) => harvest.id, { eager: true })
  @JoinColumn({ name: 'harvestId' })
  harvest: Harvest;

  @ManyToOne(() => UnitSector, (unitSector) => unitSector.id, { eager: true })
  @JoinColumn({ name: 'unitSectorId' })
  unitSector: UnitSector;

  @Column({
    type: 'integer',
    nullable: false,
  })
  count: number;

  @ManyToOne(() => WorksheetUnit, (unit) => unit.id, { eager: true })
  @JoinColumn({ name: 'unitId' })
  unit: WorksheetUnit;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  staffInCharge: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

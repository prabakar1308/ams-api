import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Worksheet } from './worksheet.entity';
import { Harvest } from './harvest.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { WorksheetUnit } from 'src/master/entities/worksheet-unit.entity';

@Entity({ schema: 'worksheet' })
export class Restock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Worksheet, (worksheet) => worksheet.id, { eager: true })
  @JoinColumn({ name: 'worksheetId' })
  worksheet: Worksheet;

  @OneToOne(() => Harvest, (harvest) => harvest.id, { eager: true })
  @JoinColumn({ name: 'harvestId' })
  harvest: Harvest;

  @Column({
    type: 'integer',
    nullable: false,
  })
  count: number;

  @ManyToOne(() => WorksheetUnit, (unit) => unit.id, { eager: true })
  unit: WorksheetUnit;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

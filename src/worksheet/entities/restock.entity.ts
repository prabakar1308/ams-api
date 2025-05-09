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
import { Unit } from 'src/master/entities/unit.entity';

@Entity({ schema: 'worksheet' })
export class Restock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Worksheet, (worksheet) => worksheet.id, { eager: true })
  @JoinColumn({ name: 'worksheetId' })
  worksheet: Worksheet;

  @OneToOne(() => Harvest)
  @JoinColumn({ name: 'harvestId' })
  harvestId: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  count: number;

  @ManyToOne(() => Unit, (unit) => unit.id, { eager: true })
  unit: Unit;

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

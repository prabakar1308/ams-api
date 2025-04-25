import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit } from './unit.entity';

export abstract class RangeColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
  })
  min: number;

  @Column({
    type: 'numeric',
  })
  max: number;

  @ManyToOne(() => Unit, (unit) => unit.id, { eager: true, nullable: true })
  @JoinColumn({ name: 'unitId' })
  unitId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  updatedBy: number;
}

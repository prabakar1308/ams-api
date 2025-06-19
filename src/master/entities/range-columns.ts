import {
  Column,
  CreateDateColumn,
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

  @Column({
    type: 'numeric',
    nullable: true,
  })
  defaultValue: number;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  step: number;

  @ManyToOne(() => Unit, (unit) => unit.id, { eager: true, nullable: true })
  // @JoinColumn({ name: 'unitId' })
  unit: Unit;

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

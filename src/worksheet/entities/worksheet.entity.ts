import { BaseEntity } from 'src/common/entities/base.entity';
import { HarvestType } from 'src/master/entities/harvest-type.entity';
import { TankType } from 'src/master/entities/tank-type.entity';
import { Unit } from 'src/master/entities/unit.entity';
import { WorksheetStatus } from 'src/master/entities/worksheet-status.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'worksheet' })
export class Worksheet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorksheetStatus, (status) => status.id, { eager: true })
  status: WorksheetStatus;

  @Column({
    type: 'decimal',
    precision: 2,
    nullable: false,
  })
  ph: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  salnity: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  temperature: number;

  @ManyToOne(() => TankType, (type) => type.id, { eager: true })
  tankType: TankType;

  @Column({
    type: 'integer',
    nullable: false,
  })
  tankNumber: number;

  @ManyToOne(() => HarvestType, (type) => type.id, { eager: true })
  harvestType: HarvestType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  harvestTime: Date;

  @Column({
    type: 'integer',
    nullable: false,
  })
  inputCount: number;

  @ManyToOne(() => Unit, (unit) => unit.id, { eager: true })
  inputUnit: Unit;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

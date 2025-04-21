import { HarvestType } from 'src/master/entities/harvest-type.entity';
import { TankType } from 'src/master/entities/tank-type.entity';
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
export class Worksheet {
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

  // @Column({
  //   type: 'integer',
  //   nullable: true,
  // })
  // tankTypeId: number;
  @ManyToOne(() => TankType, (type) => type.id, { eager: true })
  tankType: TankType;

  @Column({
    type: 'integer',
    nullable: false,
  })
  tankNumber: number;

  // @Column({
  //   type: 'integer',
  //   nullable: true,
  // })
  // harvestTypeId: number;
  @ManyToOne(() => HarvestType, (type) => type.id, { eager: true })
  harvestType: HarvestType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  harvestTime: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  inputSource: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  inputCount: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sourceUnitName?: string;

  @ManyToOne(() => User, (user) => user.worksheets, {
    eager: true, // to retrive with user details
  })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    type: 'integer',
    nullable: true,
  })
  createdBy: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  updatedBy: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  userId: number;
}

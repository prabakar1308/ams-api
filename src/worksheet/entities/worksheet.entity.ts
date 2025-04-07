import { WorksheetStatus } from 'src/master/worksheet-status.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Worksheet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorksheetStatus)
  @JoinColumn({ name: 'statusId' })
  statusId: number;

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

  @Column({
    type: 'integer',
    nullable: true,
  })
  tankTypeId: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  tankNumber: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  harvestTypeId: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  harvestTime: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  inputSource: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  tinsCount?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  bagsCount?: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sourceUnitName?: string;

  @ManyToOne(() => User, (user) => user.worksheets, {
    nullable: true,
    eager: true, // to retrive with user details
  })
  user: User | null;

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

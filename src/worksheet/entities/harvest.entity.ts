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
import { User } from 'src/users/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { WorksheetUnit } from 'src/master/entities/worksheet-unit.entity';

@Entity({ schema: 'worksheet' })
export class Harvest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Worksheet, (worksheet) => worksheet.id, { eager: true })
  @JoinColumn({ name: 'worksheetId' })
  worksheet: Worksheet;

  @Column({
    type: 'integer',
    nullable: false,
  })
  count: number;

  // same as count when it is created, will get updated based on the transit update
  @Column({
    type: 'integer',
    nullable: true,
  })
  countInStock: number;

  @ManyToOne(() => WorksheetUnit, (unit) => unit.id, { eager: true })
  unit: WorksheetUnit;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  measuredBy: User;

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

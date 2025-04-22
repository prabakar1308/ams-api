import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Worksheet } from './worksheet.entity';

@Entity({ schema: 'worksheet', orderBy: { createdAt: 'ASC' } })
export class WorksheetHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Worksheet, (worksheet) => worksheet.id)
  worksheet: Worksheet;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  previousValue: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  currentValue: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  action: string;

  @CreateDateColumn()
  createdAt: Date;
}

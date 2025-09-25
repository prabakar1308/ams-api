import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'master', name: 'source_tracker' })
export class SourceTracker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  sourceOrigin: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  count: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  generatedAt: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  unitSource: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

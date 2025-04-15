import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Worksheet } from './worksheet.entity';
import { Harvest } from './harvest.entity';

@Entity({ schema: 'worksheet' })
export class Restock {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Worksheet)
  @JoinColumn({ name: 'worksheetId' })
  worksheetId: number;

  @OneToOne(() => Harvest)
  @JoinColumn({ name: 'harvestId' })
  harvestId: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  count: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  unitName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: string;

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

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

@Entity({ schema: 'worksheet' })
export class Harvest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Worksheet)
  @JoinColumn({ name: 'worksheetId' })
  worksheetId: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  tinsCount: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  frozenCupsCount: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'measuredBy' })
  measuredBy: number;

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

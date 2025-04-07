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

@Entity()
export class Harvest {
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

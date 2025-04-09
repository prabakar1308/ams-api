import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class RangeColumns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
  })
  min: number;

  @Column({
    type: 'integer',
  })
  max: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  unit: string;

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

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'master' })
export class HarvestType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  value: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  createdBy: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  updatedBy: number;
}

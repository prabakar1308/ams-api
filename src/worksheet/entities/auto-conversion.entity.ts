import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'worksheet' })
export class AutoConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  millions: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  frozenCups: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  previousConversionAt: Date;
}

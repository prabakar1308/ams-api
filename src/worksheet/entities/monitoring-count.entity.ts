import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'worksheet' })
export class MonitoringCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  millionsHarvested: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  millionsTransited: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  frozenCupsHarvested: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  frozenCupsTransited: number;
}

import { Column, Entity } from 'typeorm';
import { GenericColumns } from './generic-columns';

@Entity({ schema: 'master' })
export class TankType extends GenericColumns {
  @Column({
    type: 'integer',
  })
  limit: string;
}

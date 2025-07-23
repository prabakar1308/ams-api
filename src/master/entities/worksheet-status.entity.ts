import { Column, Entity } from 'typeorm';
import { GenericColumns } from './generic-columns';

@Entity({ schema: 'master' })
export class WorksheetStatus extends GenericColumns {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  shortName?: string;
}

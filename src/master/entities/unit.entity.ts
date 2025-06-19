import { Entity } from 'typeorm';
import { GenericColumns } from './generic-columns';

@Entity({ schema: 'master', orderBy: { id: 'ASC' } })
export class Unit extends GenericColumns {}

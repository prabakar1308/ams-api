import { Entity } from 'typeorm';
import { GenericColumns } from './generic-columns';

@Entity({ schema: 'master' })
export class Unit extends GenericColumns {}

import { Entity } from 'typeorm';
import { RangeColumns } from './range-columns';

@Entity({ schema: 'master' })
export class Temperature extends RangeColumns {}

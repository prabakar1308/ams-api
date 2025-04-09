import { Entity } from 'typeorm';
import { RangeColumns } from './range-columns';

@Entity({ schema: 'master' })
export class Tank extends RangeColumns {}

import { IsNotEmpty } from 'class-validator';
import { PatchGenericDto } from './patch-base-generic.dto';

export class PatchTankTypeDto extends PatchGenericDto {
  @IsNotEmpty()
  limit: number;
}

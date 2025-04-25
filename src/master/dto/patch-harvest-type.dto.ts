import { IsNotEmpty } from 'class-validator';
import { PatchGenericDto } from './patch-base-generic.dto';

export class PatchHarvestTypeDto extends PatchGenericDto {
  @IsNotEmpty()
  harvestTime: number;
}

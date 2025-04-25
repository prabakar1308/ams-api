import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PatchRangeGenericDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  min: number;

  @IsNotEmpty()
  @IsNumber()
  max: number;

  @IsOptional()
  @IsNumber()
  unitId: number;
}

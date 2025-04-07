import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHarvestTypeDto {
  @IsNotEmpty()
  value: string;

  @IsOptional()
  description: string;
}

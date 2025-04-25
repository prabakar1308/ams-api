import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty()
  value: string;

  @IsOptional()
  description: string;
}

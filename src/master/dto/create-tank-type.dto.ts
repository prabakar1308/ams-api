import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTankTypeDto {
  @IsNotEmpty()
  value: string;

  @IsOptional()
  description: string;
}

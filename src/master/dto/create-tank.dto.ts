import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTankDto {
  @IsNotEmpty()
  @IsNumber()
  min: number;

  @IsNotEmpty()
  @IsNumber()
  max: number;
}

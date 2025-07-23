import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorksheetUnitDto {
  @IsNotEmpty()
  value: string;

  @IsOptional()
  brand: string;

  @IsOptional()
  specs: string;
}

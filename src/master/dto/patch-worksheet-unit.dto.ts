import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateWorksheetUnitDto } from './create-worksheet-unit.dto';

export class PatchWorksheetUnitDto extends PartialType(CreateWorksheetUnitDto) {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  value: string;

  @IsOptional()
  brand: string;

  @IsOptional()
  specs: string;
}

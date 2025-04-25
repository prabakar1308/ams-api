import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUnitDto } from './create-unit.dto';

export class PatchUnitDto extends PartialType(CreateUnitDto) {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  value: string;

  @IsOptional()
  description: string;
}

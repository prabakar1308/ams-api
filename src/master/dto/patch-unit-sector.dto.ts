import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUnitSectorDto } from './create-unit-sector.dto';

export class PatchUnitSectorDto extends PartialType(CreateUnitSectorDto) {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  location: string;
}

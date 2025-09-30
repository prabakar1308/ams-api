import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  IsDate,
} from 'class-validator';
import { CreateSourceTrackerDto } from './create-source-tracker.dto';

export class PatchSourceTrackerDto extends PartialType(CreateSourceTrackerDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  sourceOrigin?: string;

  @IsOptional()
  @IsInt()
  count?: number;

  @IsOptional()
  @IsDate()
  generatedAt?: Date;

  @IsOptional()
  @IsInt()
  updatedBy?: number;

  @IsOptional()
  @IsInt()
  unitSource?: number;
}

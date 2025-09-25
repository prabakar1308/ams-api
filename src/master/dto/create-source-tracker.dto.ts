import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateSourceTrackerDto {
  @IsString()
  @IsNotEmpty()
  sourceOrigin: string;

  @IsInt()
  @IsNotEmpty()
  count: number;

  @IsDate()
  @IsNotEmpty()
  generatedAt: Date; // Use Date if you want strict typing

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy: number;

  @IsInt()
  @IsNotEmpty()
  unitSource: number;
}

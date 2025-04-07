import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { inputSource } from '../enums/input-source.enum';

export class CreateWorksheetDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  statusId: number;

  @IsNumber()
  @IsNotEmpty()
  ph: number;

  @IsNumber()
  @IsNotEmpty()
  salnity: number;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsNumber()
  // @IsNotEmpty()
  @IsOptional()
  tankTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  tankNumber: number;

  @IsNumber()
  // @IsNotEmpty()
  @IsOptional()
  harvestTypeId: number;

  @IsISO8601()
  @IsOptional()
  harvestTime: Date;

  @IsEnum(inputSource)
  @IsOptional()
  inputSource: inputSource;

  @IsOptional()
  tinsCount?: number;

  @IsOptional()
  bagsCount?: number;

  @IsOptional()
  @IsString()
  sourceUnitName?: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

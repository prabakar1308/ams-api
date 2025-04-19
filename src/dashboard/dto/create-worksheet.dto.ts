import {
  IsDate,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { harvestType } from '../enums/harvest-type.enum';
import { inputSource } from '../enums/input-source.enum';
import { tankType } from '../enums/tank-type.enum';
import { worksheetStatus } from '../enums/worksheet-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorksheetDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  worksheetId: number;

  @ApiProperty({
    enum: worksheetStatus,
    description: 'possble values 1, 2, 3, 4, 5',
    example: 1,
  })
  @IsEnum(worksheetStatus)
  status: worksheetStatus;

  @IsNumber()
  @IsNotEmpty()
  ph: number;

  @IsNumber()
  @IsNotEmpty()
  salnity: number;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsEnum(tankType)
  tankType: tankType;

  @IsNumber()
  @IsNotEmpty()
  tankNumber: number;

  @IsEnum(harvestType)
  harvestType: harvestType;

  @IsDate()
  harvestTime: Date;

  @IsEnum(inputSource)
  inputSource: inputSource;

  @IsOptional()
  tinsCount?: number;

  @IsOptional()
  bagsCount?: number;

  @IsOptional()
  @IsString()
  sourceUnitName?: string;
}

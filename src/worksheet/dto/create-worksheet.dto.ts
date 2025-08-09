import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';

export class CreateWorksheetDto {
  @ApiProperty({
    enum: worksheetStatus,
    description: 'possble values 1, 2, 3, 4, 5',
    example: 1,
  })
  @IsNumber()
  statusId: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @IsNotEmpty()
  ph: number;

  @IsNumber()
  @IsNotEmpty()
  salnity: number;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsNumber()
  @IsNotEmpty()
  tankTypeId: number;

  @IsArray()
  @IsNotEmpty()
  tanks: number[];

  @IsNumber()
  @IsNotEmpty()
  harvestTypeId: number;

  @IsDate()
  @IsOptional()
  harvestTime: Date;

  @IsNumber()
  @IsNotEmpty()
  harvestHours: number;

  @IsNumber()
  @IsNotEmpty()
  inputCount: number;

  @IsNumber()
  @IsNotEmpty()
  inputUnitId: number;

  @IsNumber()
  userId: number;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  restocks?: number[];

  @IsDate()
  @IsOptional()
  generatedAt: Date;
}

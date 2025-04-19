import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @IsNotEmpty()
  tankTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  tankNumber: number;

  @IsNumber()
  @IsNotEmpty()
  harvestTypeId: number;

  @IsDate()
  harvestTime: Date;

  @IsString()
  inputSource: string;

  @IsNumber()
  @IsNotEmpty()
  inputCount: number;

  @IsString()
  sourceUnitName: string;

  @IsNumber()
  createdBy: number;

  @IsNumber()
  updatedBy: number;

  @IsNumber()
  userId: number;

  // @IsOptional()
  // tinsCount?: number;

  // @IsOptional()
  // bagsCount?: number;

  // @IsOptional()
  // @IsString()
  // sourceUnitName?: string;
}

import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
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

  @IsNumber()
  @IsNotEmpty()
  inputCount: number;

  @IsNumber()
  @IsNotEmpty()
  inputUnitId: number;

  @IsNumber()
  userId: number;
}

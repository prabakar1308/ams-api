import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransitDto {
  @ApiProperty({
    description: 'The restock of the corresponding harvest id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  harvestId: number;

  @ApiProperty({
    description: 'Unit sector id of this live transit',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  unitSectorId: number;

  @ApiProperty({
    description: 'Count of live transit to unit sector',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({
    description: `Count's unit id of live transit to unit sector`,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  unitId: number;

  @ApiProperty({
    description: `Person responsible in this unit sector`,
    example: 'Person name',
  })
  @IsString()
  @IsOptional()
  staffInCharge?: string;

  @IsDate()
  @IsOptional()
  generatedAt: Date;
}

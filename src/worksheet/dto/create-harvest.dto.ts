import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'The harvest of the corresponding worksheet id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  worksheetId: number;

  @ApiProperty({
    description: 'The number of tins generated in this harvest',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  tinsCount: number;

  @ApiProperty({
    description: 'The number of frozen cups generated in this harvest',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  frozenCupsCount: number;

  @ApiProperty({
    description: 'The user id of the person who created this harvest',
    example: 'GMH-AMS-001',
  })
  @IsNumber()
  @IsNotEmpty()
  measuredBy: number;

  @ApiProperty({
    description:
      'The number of restock count in millions pending in this harvest',
    example: 80,
  })
  @IsNumber()
  @IsOptional()
  restockCount: number;

  @ApiProperty({
    description: 'restock count unit name',
    example: 80,
  })
  @IsString()
  @IsOptional()
  restockUnit: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'The harvest of the corresponding worksheet id',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  worksheetId: number;

  @ApiProperty({
    description: 'The count generated in this harvest',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  count: number;

  @ApiProperty({
    description: 'The count pending for live transit',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  countInStock?: number;

  @ApiProperty({
    description: 'The unit id of count generated in this harvest',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  unitId: number;

  @ApiProperty({
    description:
      'The user id of the person who measured and creating this harvest',
    example: 'GMH-AMS-001',
  })
  @IsNumber()
  @IsNotEmpty()
  measuredBy: number;

  @ApiProperty({
    description: 'The status id of completed stage',
    example: 4,
  })
  @IsNumber()
  @IsOptional()
  statusId: number;

  @ApiProperty({
    description: 'The number of restock count pending in this harvest',
    example: 80,
  })
  @IsNumber()
  @IsOptional()
  restockCount: number;

  @ApiProperty({
    description: 'restock count unit id',
    example: 80,
  })
  @IsNumber()
  @IsOptional()
  restockUnitId: number;

  @ApiProperty({
    description: 'transit count',
    example: 80,
  })
  @IsNumber()
  @IsOptional()
  transitCount?: number;

  @ApiProperty({
    description: 'unit sector id',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  unitSectorId?: number;
}

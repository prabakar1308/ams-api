import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRestockDto {
  @ApiProperty({
    description: 'The restock of the corresponding worksheet id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  worksheetId: number;

  @ApiProperty({
    description: 'The restock of the corresponding harvest id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  harvestId: number;

  @ApiProperty({
    description: 'status of the restocked item',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description:
      'The number of restock count in millions pending in this harvest',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({
    description: 'Restock unit name',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  unitId: number;
}

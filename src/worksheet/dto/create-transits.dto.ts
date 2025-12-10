import {
  IsArray,
  IsNotEmpty,
  IsInt,
  ValidateNested,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTransitDto } from './create-transit.dto';

export class CreateTransitsDto {
  // @ApiProperty({
  //   type: 'integer',
  //   description: 'The ID of the harvest',
  //   example: 4,
  // })
  // @IsInt()
  // harvestId: number;

  @IsInt()
  @IsOptional()
  unitId?: number;

  @IsDate()
  @IsOptional()
  generatedAt: Date;

  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Transit',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransitDto)
  transits: CreateTransitDto[];
}

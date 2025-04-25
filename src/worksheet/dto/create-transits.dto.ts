import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTransitDto } from './create-transit.dto';

export class CreateTransitsDto {
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

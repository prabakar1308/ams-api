import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateHarvestDto } from './create-harvest.dto';

export class CreateHarvestsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Harvest',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHarvestDto)
  harvests: CreateHarvestDto[];
}

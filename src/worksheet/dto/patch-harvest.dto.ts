// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CreateHarvestDto } from './create-harvest.dto';

export class PatchHarvestDto extends PartialType(CreateHarvestDto) {
  @ApiProperty({
    description: 'ID of the harvest that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  countInStock?: number;

  @IsString()
  status?: string;
}

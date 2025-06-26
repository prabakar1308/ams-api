// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateTransitDto } from './create-transit.dto';

export class PatchTransitDto extends PartialType(CreateTransitDto) {
  @ApiProperty({
    description: 'ID of the transit that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsOptional()
  countInStock?: number;

  @IsBoolean()
  @IsOptional()
  isDelete?: boolean;
}

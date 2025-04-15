import { ApiPropertyOptional } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUserParamDto {
  @ApiPropertyOptional({
    description: 'Get user details with id',
    example: 'GMH-AR-1212',
  })
  @IsOptional()
  @IsInt()
  // @Type(() => Number)
  id?: number;
}

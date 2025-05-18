import { IntersectionType } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetHarvestsBaseDto {
  @IsInt()
  @IsOptional()
  unitId?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  statusIds?: string[];
}

export class GetHarvestsDto extends IntersectionType(
  GetHarvestsBaseDto,
  PaginationQueryDto,
) {}

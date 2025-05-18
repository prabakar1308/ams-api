import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetHarvestsBaseDto {
  @IsInt()
  @IsOptional()
  unitId?: number;
}

export class GetHarvestsDto extends IntersectionType(
  GetHarvestsBaseDto,
  PaginationQueryDto,
) { }

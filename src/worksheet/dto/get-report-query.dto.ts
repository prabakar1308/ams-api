import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetReportQueryBaseDto {
  @IsInt()
  @IsOptional()
  days?: number;

  @IsInt()
  @IsOptional()
  unitId?: number;
}

export class GetReportQueryDto extends IntersectionType(
  GetReportQueryBaseDto,
  PaginationQueryDto,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetReportQueryBaseDto {
  @IsInt()
  @IsOptional()
  days?: number;

  @IsInt()
  @IsOptional()
  unitId?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetReportQueryDto extends IntersectionType(
  GetReportQueryBaseDto,
  PaginationQueryDto,
) {}

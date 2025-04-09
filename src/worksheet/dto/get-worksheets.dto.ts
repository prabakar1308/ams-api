import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetWorksheetsBaseDto {
  @IsInt()
  @IsOptional()
  tankTypeId?: number;

  @IsInt()
  @IsOptional()
  statusId?: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}

export class GetWorksheetsDto extends IntersectionType(
  GetWorksheetsBaseDto,
  PaginationQueryDto,
) {}

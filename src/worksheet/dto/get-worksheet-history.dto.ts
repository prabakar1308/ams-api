import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetWorksheetHistoryBaseDto {
  @IsInt()
  @IsOptional()
  worksheetId?: number;
}

export class GetWorksheetHistoryDto extends IntersectionType(
  GetWorksheetHistoryBaseDto,
  PaginationQueryDto,
) {}

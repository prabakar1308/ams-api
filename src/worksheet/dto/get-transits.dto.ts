import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetTranistsBaseDto {
  @IsInt()
  @IsOptional()
  days?: number;
}

export class GetTransitsDto extends IntersectionType(
  GetTranistsBaseDto,
  PaginationQueryDto,
) {}

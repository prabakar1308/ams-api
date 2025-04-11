import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetUsersBaseDto {
  @IsInt()
  @IsOptional()
  userId?: number;
}

export class GetUsersDto extends IntersectionType(
  GetUsersBaseDto,
  PaginationQueryDto,
) {}

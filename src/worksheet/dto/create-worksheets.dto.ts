import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateWorksheetDto } from './create-worksheet.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorksheetsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Worksheet',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorksheetDto)
  worksheets: CreateWorksheetDto[];
}

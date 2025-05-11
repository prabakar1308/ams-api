// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PatchWorksheetDto } from './patch-worksheet.dto';
import { GetWorksheetsDto } from './get-worksheets.dto';

export class PatchWorksheetsDto {
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
  @Type(() => PatchWorksheetDto)
  worksheets: PatchWorksheetDto[];

  @IsString()
  updateAction?: string;

  @ValidateNested({ each: true })
  @Type(() => GetWorksheetsDto)
  worksheetFilter?: GetWorksheetsDto;
}

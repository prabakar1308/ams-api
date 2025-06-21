// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateWorksheetDto } from './create-worksheet.dto';
import { GetWorksheetsDto } from './get-worksheets.dto';
import { Type } from 'class-transformer';

export class PatchWorksheetDto extends PartialType(CreateWorksheetDto) {
  @ApiProperty({
    description: 'ID of the worksheet that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  statusId?: number;

  @IsInt()
  userId?: number;

  @ValidateNested({ each: true })
  @Type(() => GetWorksheetsDto)
  worksheetFilter?: GetWorksheetsDto;
}

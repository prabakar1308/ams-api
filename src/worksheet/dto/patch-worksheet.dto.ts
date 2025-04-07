// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateWorksheetDto } from './create-worksheet.dto';

export class PatchWorksheetDto extends PartialType(CreateWorksheetDto) {
  @ApiProperty({
    description: 'ID of the worksheet that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}

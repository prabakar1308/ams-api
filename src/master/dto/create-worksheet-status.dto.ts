import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorksheetStatusDto {
  @IsNotEmpty()
  value: string;

  @IsOptional()
  description: string;
}

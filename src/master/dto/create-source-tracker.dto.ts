import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSourceTrackerDto {
  @IsString()
  @IsNotEmpty()
  sourceOrigin: string;

  @IsInt()
  @IsNotEmpty()
  count: number;

  @IsDate()
  @IsOptional()
  generatedAt?: Date;

  @IsInt()
  @IsNotEmpty()
  unitSource: number;
}

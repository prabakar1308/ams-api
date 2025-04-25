import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUnitSectorDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  location: string;
}

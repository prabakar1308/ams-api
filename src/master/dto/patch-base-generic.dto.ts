import { IsNotEmpty, IsOptional } from 'class-validator';

export class PatchGenericDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  value: string;

  @IsOptional()
  description: string;
}

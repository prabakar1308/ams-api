import { IsInt } from 'class-validator';

export class GetWorksheetStatusDto {
  @IsInt()
  userId: number;

  @IsInt({ message: 'Tank Type Id must be an integer' })
  tankTypeId: number;

  @IsInt({ message: 'Status Id must be an integer' })
  statusId: number;
}

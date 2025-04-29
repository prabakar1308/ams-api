import { Worksheet } from '../entities/worksheet.entity';

export interface ActiveWorksheet {
  tankNumber: number;
  worksheet: Worksheet | null;
}

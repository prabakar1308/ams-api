import { Worksheet } from 'src/worksheet/entities/worksheet.entity';

export interface ActiveWorksheet {
  tankNumber: number;
  worksheet: Worksheet | null;
}

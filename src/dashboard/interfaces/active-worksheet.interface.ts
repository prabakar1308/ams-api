import { User } from 'src/users/user.entity';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';

export interface ActiveWorksheet {
  tankNumber: number;
  user: User | null;
  worksheet: Worksheet | null;
}

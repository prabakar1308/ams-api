import { Worksheet } from '../entities/worksheet.entity';

export interface ActiveWorksheet {
  tankNumber: number;
  worksheet: Worksheet | null;
}

export interface WorksheetTank {
  tankNumber: number;
  worksheetId?: number;
  harvestType?: { id: number; value: string };
  inputSource?: string;
  assignedUser?: { id: number; value: string };
  status?: { id: number; value: string };
  harvestTimeDiff?: {
    text: string;
    isPast: boolean;
  };
}

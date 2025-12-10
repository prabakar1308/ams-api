import { Worksheet } from '../entities/worksheet.entity';

export interface ActiveWorksheet {
  tankNumber: number;
  worksheet: Worksheet | null;
}

export interface WorksheetTank {
  tankNumber: number;
  worksheetId?: number;
  tankType?: { id: number; value: string };
  harvestType?: { id: number; value: string };
  inputSource?: string;
  assignedUser?: { id: number; value: string };
  status?: { id: number; value: string };
  harvestHours?: number;
  timeDifference?: {
    text: string;
    status: string;
  };
  generatedAt?: Date;
  parameters?: WorksheetParameters[];
}

export interface WorksheetParameters {
  label: string;
  value: string;
}

export interface ActiveRestock {
  id: number;
  generatedAt: Date;
  createdBy: string;
  status: string;
  count: number;
  unit: string;
  unitId?: number;
  harvest?: string;
  worksheetId?: number;
  worksheet: {
    tankType?: string;
    harvestType?: string;
    tankNumber?: number;
    inputValue?: string;
  };
}

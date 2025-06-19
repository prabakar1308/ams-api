export interface ActiveRestock {
  id: number;
  createdAt: Date;
  createdBy: string;
  status: string;
  count: number;
  unit: string;
  unitId?: number;
  harvest?: string;
  worksheet: {
    tankType?: string;
    harvestType?: string;
    tankNumber?: number;
    inputValue?: string;
  };
}

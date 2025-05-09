export interface ActiveRestock {
  id: number;
  createdAt: Date;
  createdBy: number;
  status: string;
  count: number;
  unit: string;
  unitId?: number;
  worksheet: {
    tankType?: string;
    tankNumber?: number;
  };
}

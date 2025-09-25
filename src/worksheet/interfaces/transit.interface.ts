export interface TransitResponse {
  id: number;
  harvestId?: number;
  createdAt?: Date;
  generatedAt: Date;
  createdBy: string;
  createdById?: number;
  harvestCount?: string;
  transitCount: string;
  staffInCharge?: string;
  unitSector: {
    id?: number;
    name?: string;
    location?: string;
  };
  worksheet?: {
    tankNumber: number;
    tankType: string;
  };
  count?: number;
  countInStock?: number;
  unitId?: number;
  unitName?: string;
}

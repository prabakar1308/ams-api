export interface TransitResponse {
  id: number;
  harvestId?: number;
  createdAt?: Date;
  generatedAt: Date;
  createdBy: string;
  harvestCount: string;
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
  unitName?: string;
}

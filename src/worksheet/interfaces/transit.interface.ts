export interface TransitResponse {
  id: number;
  createdAt: Date;
  createdBy: string;
  harvestCount: string;
  transitCount: string;
  unitSector: {
    name?: string;
    location?: string;
  };
}

import { Column } from 'typeorm';

// This class is used to define common columns for all entities.
export class BaseEntity {
  @Column({ nullable: false })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;
}

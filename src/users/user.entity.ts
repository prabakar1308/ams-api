import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UnitSector } from 'src/master/entities/unit-sector.entity';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'master' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  @IsEmail()
  email: string;

  @Column()
  mobileNumber: string;

  @Column()
  role: string;

  @Column()
  designation: string;

  @ManyToOne(() => UnitSector, (unitSector) => unitSector.id, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'unitSectorId' })
  unitSectorId: number;

  @Column()
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column()
  dateOfJoining: Date;

  @Column()
  remarks: string;

  @OneToMany(() => Worksheet, (worksheet) => worksheet.user)
  worksheets: Worksheet[]; // Assuming a user can have multiple worksheets

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

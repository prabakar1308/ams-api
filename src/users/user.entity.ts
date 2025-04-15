import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'master' })
export class User {
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

  @Column()
  departmentUnit: string;

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

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  updatedBy: number;
}

import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
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
}

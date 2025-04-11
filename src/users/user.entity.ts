import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Worksheet } from 'src/worksheet/entities/worksheet.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}

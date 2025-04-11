/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDate,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsString({ message: 'User ID must be a string' })
  @MaxLength(50)
  userId: string;

  @IsString({ message: 'First Name1 must be a string' })
  @MaxLength(96)
  firstName: string;

  @IsString({ message: 'Last Name must be a string' })
  @MaxLength(96)
  lastName: string;

  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsString({ message: 'Role must be a string' })
  @IsEnum(UserRole)
  role: string;

  @IsString({ message: 'Designation must be a string' })
  designation: string;

  @IsString({ message: 'Department Unit must be a string' })
  departmentUnit: string;

  @IsMobilePhone(
    'en-IN',
    { strictMode: false },
    { message: 'Mobile number is not valid' },
  )
  mobileNumber: string;

  @IsDate()
  dateOfBirth: Date;

  @IsString({ message: 'Address must be a string' })
  address: string;

  @IsDate()
  dateOfJoining: Date;

  @IsOptional()
  remarks: string;
}

export class CreateUserResponseDto {
  id: number;
  firstName: string;
  mobileNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
export class CreateUserRequestDto {
  firstName: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

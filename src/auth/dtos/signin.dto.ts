import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // this is user code of user entity

  @IsNotEmpty()
  @IsString()
  password: string;
}

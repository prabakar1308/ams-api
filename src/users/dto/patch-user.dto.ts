import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class PatchUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  id: number;
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetches a list of users',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'the number of entries per query',
    example: 10,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.usersService.findAll(getUsersDto);
  }

  @Auth(AuthType.None)
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @UseInterceptors(ClassSerializerInterceptor)
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return this.usersService.updateUser(patchUserDto);
  }

  @ApiOperation({
    summary: 'Soft-Delete a worksheet',
  })
  @Delete('delete-user')
  public softDeleteUser(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @ApiOperation({
    summary: 'Generate a new user code based on the last user',
  })
  @Get('generate-user-code')
  public generateUserCode() {
    return this.usersService.generateUserCode();
  }
}

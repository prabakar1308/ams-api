import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //   @Get('users')
  //   public getUsers() {
  //     return 'users';
  //   }

  // @Get('users{/:id}')
  // public getUser(
  //   @Query() query: any,
  //   @Param('id', new DefaultValuePipe(1), ParseIntPipe) id?: number,
  // ) {
  //   console.log(id);
  //   console.log(query);
  //   return 'users 1';
  // }

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

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('{/:id}')
  public patchUser(
    @Param('id') id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    console.log(id);
    console.log(patchUserDto);
    return patchUserDto;
  }
}

import {
  Body,
  Controller,
  DefaultValuePipe,
  // DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  // ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserParamDto } from './dto/get-user-param.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

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

  @Get('{/:id}')
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
  public getUser(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(10), ParseIntPipe) page: number,
    @Param() getUserParamDto: GetUserParamDto,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  @Post()
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

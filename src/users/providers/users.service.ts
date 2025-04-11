import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByIdProvider } from './find-user-by-id.provider';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { GetUsersDto } from '../dto/get-users.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findUserById: FindUserByIdProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async findOneByUserId(userId: string) {
    console.log(this.findUserById);
    return await this.findUserById.findOneByUserId(userId);
  }

  public async findAll(getUsersDto: GetUsersDto): Promise<Paginated<User>> {
    return await this.paginationProvider.paginateQuery<User>(
      {
        limit: getUsersDto.limit,
        page: getUsersDto.page,
      },
      this.userRepository,
    );
  }

  public async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}

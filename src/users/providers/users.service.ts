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
import { UpdateUserProvider } from './update-user.provider';
import { PatchUserDto } from '../dto/patch-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly updateUserProvider: UpdateUserProvider,
    private readonly findUserById: FindUserByIdProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async updateUser(patchUserDto: PatchUserDto) {
    return await this.updateUserProvider.updateUser(patchUserDto);
  }

  public async resetPassword(userId: string, newPassword: string) {
    return await this.updateUserProvider.resetPassword(userId, newPassword);
  }

  public async findOneByUserCode(userCode: string) {
    return await this.findUserById.findOneByUserCode(userCode);
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

  public async getUserNameById(userId: number): Promise<string> {
    return await this.findUserById.getUserNameById(userId);
  }

  public async deleteUser(id: number) {
    return await this.userRepository.softDelete(id);
  }

  public async generateUserCode(): Promise<string> {
    // Find the last user by ID (assuming higher ID = latest)
    const lastUser = await this.userRepository.findOne({
      where: {},
      order: { id: 'DESC' },
      select: ['id', 'userCode'],
    });

    let nextNumber = 1;
    if (lastUser && lastUser.userCode) {
      // Extract the numeric part from the last userCode (e.g., "USR0005" -> 5)
      const match = lastUser.userCode.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `GMH-AMS-${nextNumber}`;
  }
}

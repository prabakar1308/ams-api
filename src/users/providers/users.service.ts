import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dto/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByIdProvider } from './find-user-by-id.provider';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findUserById: FindUserByIdProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async findOneByUserId(userId: string) {
    return this.findUserById.findOneByUserId(userId);
  }

  public findAll(
    getUserParamDto: GetUserParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    console.log(getUserParamDto, limit, page);
    return [
      {
        userId: 'GHM-A-123',
        firstName: 'Praba',
        lastName: 'G',
        mobileNumber: '93434343434',
      },
      {
        userId: 'GHM-A-1234',
        firstName: 'Praba1',
        lastName: 'A',
        mobileNumber: '93434343434',
      },
    ];
  }

  public async findOneById(id: number) {
    // const isAuth = this.authService.isAuth();
    return await this.userRepository.findOneBy({ id });
  }
}

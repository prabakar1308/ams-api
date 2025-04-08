import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamDto } from '../dto/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check if user already exists
    try {
      const user = await this.userRepository.findOneBy({
        userId: createUserDto.userId,
      });
      // another way to check if user already exists
      // const user = await this.userRepository.findOne({
      //   where: { userId: createUserDto.userId },
      // });
      if (user) {
        throw new BadRequestException('The user already exists, Please check.');
        return {
          statusCode: 409,
          message: 'User already exists',
        };
      }
    } catch {
      throw new RequestTimeoutException(
        'Unable to process the request now. Please try again!',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    // create user
    const newUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(newUser);
    return {
      statusCode: 201,
      message: 'User created successfully',
      data: savedUser,
    };
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

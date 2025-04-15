import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check if user already exists
    let existingUser: User | null;
    try {
      existingUser = await this.userRepository.findOneBy({
        userId: createUserDto.userId,
      });
      // another way to check if user already exists
      // const user = await this.userRepository.findOne({
      //   where: { userId: createUserDto.userId },
      // });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Unable to process the request now. Please try again!',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException('The user already exists, Please check.');
    }
    // create user
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    const savedUser = await this.userRepository.save(newUser);
    return {
      statusCode: 201,
      message: 'User created successfully',
      data: savedUser,
    };
  }
}

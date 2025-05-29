import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByIdProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByUserCode(userCode: string) {
    let user: User | null;

    try {
      // null if user is not found
      user = await this.usersRepository.findOneBy({ userCode });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return user;
  }

  public async getUserNameById(userId: number): Promise<string> {
    let user: User | null;

    try {
      // Find the user by ID
      user = await this.usersRepository.findOneBy({ id: userId });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    // Return the user's name
    return `${user.firstName} ${user.lastName}`;
  }
}

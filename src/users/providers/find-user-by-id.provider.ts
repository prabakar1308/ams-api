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
}

import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { PatchUserDto } from '../dto/patch-user.dto';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async updateUser(patchUserDto: PatchUserDto) {
    // check if user already exists
    let existingUser: User | null;
    try {
      existingUser = await this.userRepository.findOneBy({
        id: patchUserDto.id,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process the request now. Please try again!',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!existingUser) {
      throw new BadRequestException('The user does not exists, Please check.');
    }
    // update user
    const updatedUser = this.userRepository.create({
      ...existingUser,
      ...patchUserDto,
    });
    return await this.userRepository.save(updatedUser);
  }
}

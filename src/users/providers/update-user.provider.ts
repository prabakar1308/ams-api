import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { PatchUserDto } from '../dto/patch-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
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

  public async resetPassword(
    userId: string,
    newPassword: string,
  ): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findOneBy({ userCode: userId });
    if (!user) {
      throw new BadRequestException('The user does not exist, Please check.');
    }

    // Hash the new password (assuming you have a hashing provider/service)
    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    // Update the password
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }
}

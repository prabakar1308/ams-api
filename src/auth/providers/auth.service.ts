import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(email: string, password: string, id: string) {
    const user = this.usersService.findOneById(1234);

    console.log(email, password, id, user);

    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}

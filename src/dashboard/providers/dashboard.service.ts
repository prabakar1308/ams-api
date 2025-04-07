import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class DashboardService {
  constructor(private readonly usersService: UsersService) {}

  public getActiveWorksheets(id: number) {
    console.log(id);
    const user = this.usersService.findOneById(id);

    return [
      {
        id: 1,
        tankNumber: 1,
        tankType: 'machinery',
        status: 'Open/Free',
        user,
      },
      {
        id: 2,
        tankNumber: 2,
        tankType: 'conventional',
        status: 'Open/Free',
        user,
      },
    ];
  }
}

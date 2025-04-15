import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWorksheetDto } from '../dto/create-worksheet.dto';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Worksheet } from '../entities/worksheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class WorksheetCreateProvider {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Worksheet)
    private readonly worksheetRespository: Repository<Worksheet>,
  ) {}

  public async createWorksheet(
    worksheet: CreateWorksheetDto,
    user: ActiveUserData,
  ) {
    let currentUser: User | null;
    try {
      currentUser = await this.userService.findOneById(user.sub);
    } catch (error) {
      throw new ConflictException(error);
    }

    const newWorksheet = this.worksheetRespository.create({
      ...worksheet,
      user: currentUser,
    });

    try {
      return await this.worksheetRespository.save(newWorksheet);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure the worksheet parameters are correct.',
      });
    }
  }
}

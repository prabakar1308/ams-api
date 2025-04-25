import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByIdProvider } from './providers/find-user-by-id.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UpdateUserProvider } from './providers/update-user.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindUserByIdProvider,
    UpdateUserProvider,
  ],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    PaginationModule,
  ],
})
export class UsersModule {}

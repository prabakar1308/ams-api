import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { MasterModule } from './master/master.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorksheetModule } from './worksheet/worksheet.module';

@Module({
  imports: [
    UsersModule,
    DashboardModule,
    MasterModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      // useFactory is a function that returns a configuration object for TypeORM
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'pgadmin1234',
        database: process.env.DB_NAME || 'gms',
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // entities: [User],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    WorksheetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

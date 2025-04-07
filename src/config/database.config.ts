import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  userName: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'pgadmin1234',
  dbName: process.env.DB_NAME || 'gms',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));

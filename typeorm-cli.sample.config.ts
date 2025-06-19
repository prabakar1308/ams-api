import { DataSource } from 'typeorm';

module.exports = new DataSource({
  type: 'postgres', // or 'postgres', 'mssql', etc.
  host: 'localhost',
  port: 5432, // change according to your DB
  username: 'postgres',
  password: 'gmh_ams_2025',
  database: 'gms',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['migrations/*.{ts,js}'],
  synchronize: false, // set to false for production
  logging: true,
});

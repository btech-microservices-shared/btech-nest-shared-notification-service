import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from './env.config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: envs.database.host,
  port: envs.database.port,
  username: envs.database.username,
  password: envs.database.password,
  database: envs.database.name,
  autoLoadEntities: true,
  synchronize: envs.database.synchronize,
};

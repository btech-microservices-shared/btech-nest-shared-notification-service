import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUDIT_SERVICE } from './config/constants';
import { join } from 'path';
import { envs } from './config/env.config';
import { AuditClient } from './common/clients';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EmailsModule,
    ClientsModule.register([
      {
        name: AUDIT_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'audit',
          protoPath: join(process.cwd(), 'src/common/proto/audit.proto'),
          url: envs.audit.url,
          keepalive: {
            keepaliveTimeMs: 30000,
            keepaliveTimeoutMs: 5000,
            keepalivePermitWithoutCalls: 1,
          },
          loader: {
            keepCase: true,
            defaults: true,
          },
        },
      },
    ]),
  ],
  providers: [AuditClient],
})
export class AppModule {}

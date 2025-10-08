import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUDIT_SERVICE } from '../config/constants';
import { join } from 'path';
import { envs } from '../config/env.config';
import { AuditClient } from './clients';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUDIT_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'audit',
          protoPath: join(process.cwd(), 'src/grpc/proto/audit.proto'),
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
  exports: [AuditClient],
})
export class GrpcModule {}

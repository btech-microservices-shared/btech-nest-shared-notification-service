import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { GrpcModule } from './grpc/grpc.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './common/interceptors';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), EmailsModule, GrpcModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}

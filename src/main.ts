import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { createValidationExceptionFactory } from './common/factories';
import { ServiceExceptionFilter } from './common/filters';
import { envs, SERVICE_NAME } from './config';
import { format } from 'util';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'emails',
        protoPath: join(process.cwd(), 'src/grpc/proto/emails.proto'),
        url: format('0.0.0.0:%d', envs.grpc.port),
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: createValidationExceptionFactory(SERVICE_NAME),
    }),
  );
  app.useGlobalFilters(new ServiceExceptionFilter(SERVICE_NAME));
  await app.listen();
}
bootstrap();

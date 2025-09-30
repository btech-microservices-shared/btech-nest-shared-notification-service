import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { createValidationExceptionFactory } from './common/factories/create-validation-exception.factory';
import { SERVICE_NAME } from './config/constants';
import { ServiceExceptionFilter } from './common/filters/service-exception.filter';
import { envs } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'emails',
        protoPath: join(process.cwd(), 'src/common/proto/emails.proto'),
        url: `0.0.0.0:${envs.grpc.port}`,
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

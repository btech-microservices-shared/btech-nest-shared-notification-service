import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { MAILING_PACKAGE_NAME } from './application/interfaces/proto/mailing'
import { ConfigService } from './libs/infrastructure/config'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const configService = appContext.get(ConfigService)

	const grpcPort = configService.getNumberAndCheck('GRPC_PORT')
	const grpcHost = configService.get('GRPC_HOST')

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.GRPC,
		options: {
			url: `${grpcHost}:${grpcPort}`,
			package: MAILING_PACKAGE_NAME,
			protoPath: process.cwd() + '/proto/mailing.proto'
		}
	})

	await app.listen()
}
bootstrap()

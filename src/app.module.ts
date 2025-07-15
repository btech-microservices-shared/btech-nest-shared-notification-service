import { Logger, Module } from '@nestjs/common'
import { ResendMailingServiceProvider, sendUseCaseProvider, templateServiceProvider, themeServiceProvider } from './app.provider'
import { MailingController } from './application/controllers/maling.grpc.controller'
import { MailingService } from './application/services/mailing.service'
import { ConfigModule } from './libs/infrastructure/config'

@Module({
	imports: [ConfigModule],
	controllers: [MailingController],
	providers: [
		Logger,
		// SesMailingServiceProvider,
		sendUseCaseProvider,
		ResendMailingServiceProvider,
		templateServiceProvider,
		themeServiceProvider,
		MailingService
	]
})
export class AppModule {}

import { ClassProvider, FactoryProvider, Logger, Scope } from '@nestjs/common'
import { MailingService } from './domain/services/mailing.service'
import { TemplateService } from './domain/services/template.service'
import { ThemeService } from './domain/services/theme.service'
import { SendUseCase } from './domain/use-cases/send.use-case'
import { ResendMailingService } from './infrastructure/providers/mail/resend-mailing-impl.service'
import { TemplateServiceImpl } from './infrastructure/providers/template/template.service.impl'
import { ThemeServiceImpl } from './infrastructure/providers/theme/theme.service.impl'
import { ConfigService } from './libs/infrastructure/config'

// export const SesMailingServiceProvider: ClassProvider<MailingService> = {
// 	provide: MailingService,
// 	useClass: SESMailingService
// }

export const ResendMailingServiceProvider: ClassProvider<MailingService> = {
	provide: MailingService,
	useClass: ResendMailingService
}

export const templateServiceProvider: ClassProvider<TemplateService<unknown>> = {
	provide: TemplateService,
	useClass: TemplateServiceImpl
}

export const themeServiceProvider: ClassProvider<ThemeService> = {
	provide: ThemeService,
	useClass: ThemeServiceImpl
}

export const sendUseCaseProvider: FactoryProvider<SendUseCase> = {
	provide: SendUseCase,
	inject: [Logger, MailingService, TemplateService, ConfigService],
	useFactory: (logger: Logger, mailingService: MailingService, configService: ConfigService) => {
		return new SendUseCase(logger, mailingService, configService)
	},
	scope: Scope.DEFAULT
}

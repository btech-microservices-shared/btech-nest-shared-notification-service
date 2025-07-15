import { Inject, Injectable, Logger, Type } from '@nestjs/common'
import { ContextIdFactory, ModuleRef, REQUEST } from '@nestjs/core'

import { Message } from 'src/domain/entities/message.entity'
import { TemplateService } from 'src/domain/services/template.service'
import { SendUseCase } from 'src/domain/use-cases/send.use-case'
import { ConfigService } from 'src/libs/infrastructure/config'
import { SendCodeDto } from '../dtos/send-code.dto'

@Injectable()
export class MailingService {
	constructor(
		@Inject(REQUEST) private readonly request: unknown,
		private readonly moduleRef: ModuleRef,
		private readonly logger: Logger,
		private readonly configService: ConfigService,
		private readonly templateService: TemplateService<unknown>
	) {}

	async #_resolve<T>(typeOrToken: Type<T>): Promise<T> {
		return await this.moduleRef.resolve(typeOrToken, ContextIdFactory.getByRequest(this.request), { strict: true })
	}

	async sendCode({ to, code, companyName, logoUrl }: SendCodeDto): Promise<void> {
		this.logger.log(`inside ${this.constructor.name}.${this.sendCode.name}()`)

		const useCase = await this.#_resolve(SendUseCase)

		const template = await this.templateService.renderTemplate('send-code', {
			code,
			companyName,
			logoUrl
		})

		const message = new Message({
			to: to,
			body: template,
			subject: this.configService.getAndCheck('SUBJECT_FORM'),
			from: `${companyName} <${this.configService.getAndCheck('SENDER_NOREPLY')}>`
		})

		await useCase.execute(message)
	}
}

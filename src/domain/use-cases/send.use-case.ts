import { Logger } from '@nestjs/common'
import { ConfigService } from 'src/libs/infrastructure/config'
import { Message } from '../entities/message.entity'
import { MailingService } from '../services/mailing.service'

export class SendUseCase {
	constructor(
		private readonly logger: Logger,
		private readonly mailingService: MailingService,
		private readonly configService: ConfigService
	) {}

	async execute(message: Message): Promise<void> {
		this.logger.log(`inside ${this.constructor.name}.${this.execute.name}()`)

		await this.mailingService.send(message)
	}
}

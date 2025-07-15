import { Injectable, Logger } from '@nestjs/common'
import { Resend } from 'resend'
import { Message } from 'src/domain/entities/message.entity'
import { MailingService } from 'src/domain/services/mailing.service'
import { ConfigService } from 'src/libs/infrastructure/config'

@Injectable()
export class ResendMailingService extends MailingService {
	readonly #_client: Resend

	constructor(
		private readonly logger: Logger,
		private readonly configService: ConfigService
	) {
		super()
		this.#_client = new Resend(this.configService.getAndCheck('RESEND_API_KEY'))
	}

	async send(data: Message): Promise<void> {
		this.logger.log(`inside ${this.constructor.name}.${this.send.name}()`)

		try {
			await this.#_client.emails.send({
				from: data.from,
				to: data.to.split(','),
				subject: data.subject,
				html: data.body
			})

			this.logger.log('Email sent successfully with Resend')
		} catch (error) {
			this.logger.error('Error sending email with Resend', error)
			throw error
		}
	}
}

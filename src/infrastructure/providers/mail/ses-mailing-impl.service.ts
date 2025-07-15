import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { Injectable, Logger } from '@nestjs/common'
import { Message } from 'src/domain/entities/message.entity'
import { MailingService } from 'src/domain/services/mailing.service'
import { ConfigService } from 'src/libs/infrastructure/config'

@Injectable()
export class SESMailingService extends MailingService {
	readonly #_client: SESClient

	constructor(
		private readonly logger: Logger,
		private readonly configService: ConfigService
	) {
		super()
		this.#_client = new SESClient({
			region: this.configService.getAndCheck('AWS_REGION'),
			credentials: {
				accessKeyId: this.configService.getAndCheck('ACCESS_KEY'),
				secretAccessKey: this.configService.getAndCheck('SECRET_ACCESS_KEY')
			}
		})
	}

	async send(data: Message): Promise<void> {
		this.logger.log(`inside ${this.constructor.name}.${this.send.name}()`)

		const command = new SendEmailCommand({
			Destination: {
				ToAddresses: data.to.split(',')
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: data.body
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: data.subject
				}
			},
			Source: data.from
		})

		try {
			await this.#_client.send(command)
			this.logger.log('Email sent successfully')
		} catch (error) {
			this.logger.error('Error sending email', error)
		}
	}
}

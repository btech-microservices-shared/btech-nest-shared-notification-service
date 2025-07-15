import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { SendCodeDto } from '../dtos/send-code.dto'
import { MAILING_SERVICE_NAME, MailingServiceController } from '../interfaces/proto/mailing'
import { MailingService } from '../services/mailing.service'

@Controller()
export class MailingController implements MailingServiceController {
	constructor(private readonly mailingService: MailingService) {}

	@GrpcMethod(MAILING_SERVICE_NAME, 'SendCode')
	async sendCode(request: SendCodeDto): Promise<void> {
		await this.mailingService.sendCode(request)
	}
}

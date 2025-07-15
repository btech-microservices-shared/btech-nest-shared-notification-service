import { Message } from '../entities/message.entity'

export abstract class MailingService {
	abstract send(data: Message): Promise<void>
}

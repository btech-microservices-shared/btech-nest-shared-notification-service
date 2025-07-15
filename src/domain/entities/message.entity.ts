import { Attachment } from './attachment.entity'
import { MessageOptions } from './message-optipns.entity'

export class Message {
	to: string
	from: string
	subject: string
	body: string
	replyTo?: string
	attachments?: Attachment[]
	options?: MessageOptions

	constructor(partial?: Partial<Message>) {
		Object.assign(this, partial)
	}
}

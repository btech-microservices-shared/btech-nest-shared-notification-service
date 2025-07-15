import { ConsoleLogger } from '@nestjs/common'

export class DefaultLogger extends ConsoleLogger {
	constructor(public context: string) {
		super(context, { timestamp: true })
	}
}

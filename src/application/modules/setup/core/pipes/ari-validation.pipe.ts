import { Injectable, Optional, ValidationPipe, ValidationPipeOptions } from '@nestjs/common'
import { isUnset } from 'src/libs/lib/utils'

@Injectable()
export class AriValidationPipe extends ValidationPipe {
	constructor(@Optional() options: ValidationPipeOptions = {}) {
		if (isUnset(options.transform)) {
			options.transform = true
		}

		if (isUnset(options.validationError)) {
			options.validationError = {}
		}

		Object.assign(options.validationError, {
			target: true,
			value: true
		})

		super(options)
	}
}

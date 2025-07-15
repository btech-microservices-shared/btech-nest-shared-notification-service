import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { BaseException, InvalidOperationException, InvalidValueException, ResourceNotFoundException } from '../../../core/exceptions'
import { BaseErrorResult, ErrorFilter } from './error.filter'
import { ConflictExceptionWithCode } from '../exceptions/conflict-exception-with-code'

export abstract class ApplicationErrorFilter<T extends Error = Error> extends ErrorFilter {
	protected buildError(exception: T): BaseErrorResult {
		let finalException: Error = exception

		if (exception instanceof BaseException) {
			switch (true) {
				case exception instanceof ResourceNotFoundException:
					finalException = new NotFoundException(exception.message)
					break

				case exception instanceof InvalidValueException:
					finalException = new BadRequestException(exception.message)
					break

				case exception instanceof InvalidOperationException:
					const _exception = exception as InvalidOperationException
					finalException = new ConflictExceptionWithCode(_exception.message, _exception.code, _exception.data)
					break

				default:
					finalException = new InternalServerErrorException(exception.message)
			}
		}

		// if (exception['code'] !== null && exception['details'] !== null && exception['metadata'] !== null) {
		// 	const statusCode = exception['code'] as status
		// 	const metadata = exception['metadata'] as Metadata
		// 	const metadataValues = metadata.getMap() as { code: string; message: string }
		// 	const details = (exception['details'] as string).split(',')

		// 	const message = details[0]
		// 	const stack = details[1]

		// 	switch (statusCode) {
		// 		case status.INVALID_ARGUMENT:
		// 			finalException = new BadRequestException(message)
		// 			break

		// 		case status.UNAUTHENTICATED:
		// 			finalException = new UnauthorizedException(message)
		// 			break

		// 		case status.PERMISSION_DENIED:
		// 			finalException = new ForbiddenException(message)
		// 			break

		// 		case status.NOT_FOUND:
		// 			finalException = new NotFoundException(message)
		// 			break

		// 		case status.ALREADY_EXISTS:
		// 			const code = metadataValues['code'] ?? null

		// 			finalException = new ConflictExceptionWithCode(message, parseInt(code), null)

		// 			break

		// 		case status.UNAVAILABLE:
		// 			finalException = new ServiceUnavailableException(message)
		// 			break

		// 		case status.DEADLINE_EXCEEDED:
		// 			finalException = new GatewayTimeoutException(message)
		// 			break

		// 		case status.UNKNOWN:
		// 		default:
		// 			finalException = new InternalServerErrorException(message)
		// 			break
		// 	}

		// 	finalException.stack = stack
		// }

		return super.buildError(finalException)
	}
}

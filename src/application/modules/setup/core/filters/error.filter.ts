import { HttpException, HttpStatus } from '@nestjs/common'
import { LoggerFactory } from 'src/libs/core/logger'
import { isString } from 'src/libs/lib/utils'

export interface ErrorResponse {
	statusCode: number
	error: string
	message?: string
	stack?: string
	code?: number
	data?: Record<string, any>
}

export interface BaseErrorResult {
	statusCode: number
	error: ErrorResponse
}

export abstract class ErrorFilter<T extends Error = Error> {
	private readonly logger = LoggerFactory.create(this.constructor.name)

	protected buildError(exception: T): BaseErrorResult {
		const isHttpException = exception instanceof HttpException
		const statusCode: number = isHttpException ? (exception as unknown as HttpException).getStatus() : exception['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR
		const result: BaseErrorResult = {
			statusCode,
			error: null
		}

		if (isString(exception)) {
			exception = new Error(exception as unknown as string) as T
		}

		this.logger.error(`isHttpException -> ${isHttpException}`)
		this.logger.error(`statusCode  -> ${statusCode}`)
		this.logger.error(`constructor.name  -> ${exception.constructor.name}`)
		this.logger.error(exception.message, exception.stack)

		// TODO: implementar insert de log de errores (REVISAR)
		// if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR)
		// 	console.log(exception)

		if (isHttpException) {
			result.error = (exception as unknown as HttpException).getResponse() as any
		} else {
			const { message, stack } = exception
			result.error = {
				statusCode: exception['statusCode'] || statusCode,
				error: exception.name || exception['error'] || 'Error',
				message,
				stack,
				code: exception['code'] ?? undefined,
				data: exception['data'] ?? undefined
			}
		}

		return result
	}
}

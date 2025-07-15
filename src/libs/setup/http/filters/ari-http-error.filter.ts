import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ApplicationErrorFilter } from '../../core/filters/application-error.filter'

@Catch()
export class AriHttpErrorFilter extends ApplicationErrorFilter implements ExceptionFilter<Error> {
	catch(exception: Error, host: ArgumentsHost) {
		const { statusCode, error } = this.buildError(exception)
		const res = host.switchToHttp().getResponse<FastifyReply>()

		res.status(statusCode)

		switch (statusCode) {
			case HttpStatus.NO_CONTENT:
				res.send()
				break
			default:
				res.send(error)
		}
	}
}

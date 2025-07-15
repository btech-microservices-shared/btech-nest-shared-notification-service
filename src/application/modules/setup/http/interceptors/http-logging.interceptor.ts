import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Observable, tap } from 'rxjs'
import { RequestLogger } from '../../core/logger/tokens/request-logger'

@Injectable({ scope: Scope.REQUEST })
export class HttpLoggingInterceptor implements NestInterceptor {
	constructor(private readonly requestLogger: RequestLogger) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const req = context.switchToHttp().getRequest<FastifyRequest>()
		const res = context.switchToHttp().getResponse<FastifyReply>()

		// const { logger } = req

		this.requestLogger.log(`\n===========================================================================================================================`)
		console.time(`TIMING -> ${this.requestLogger.context}`)
		this.requestLogger.log(`REQUEST BODY`)
		this.requestLogger.log(JSON.stringify(req.body))

		this.requestLogger.log('')
		this.requestLogger.log(`REQUEST HEADERS`)
		Object.keys(req.headers).forEach(key => {
			this.requestLogger.log(`${key}: ${req.headers[key]}`)
		})
		this.requestLogger.log('')

		return next.handle().pipe(
			tap({
				next: value => {
					this.requestLogger.log('')
					this.requestLogger.log(`RESPONSE STATUS CODE`)
					this.requestLogger.log(res.statusCode)
					this.requestLogger.log(`RESPONSE BODY`)
					this.requestLogger.log(JSON.stringify(value))
				},
				complete: () => {
					const responseHeaders = res.getHeaders()

					this.requestLogger.log('')
					this.requestLogger.log(`RESPONSE HEADERS`)
					Object.keys(responseHeaders).forEach(key => {
						this.requestLogger.log(`${key}: ${responseHeaders[key]}`)
					})
					console.timeEnd(`TIMING -> ${this.requestLogger.context}`)
					this.requestLogger.log(`\n===========================================================================================================================\n`)
				}
			})
		)
	}
}

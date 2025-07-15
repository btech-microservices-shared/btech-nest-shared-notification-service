import 'fastify'
import { FastifyHeaderValues } from './fastify-header-values'

declare module 'fastify' {
	export interface FastifyRequest {
		logger: LoggerService
		headerValues: FastifyHeaderValues
	}
}

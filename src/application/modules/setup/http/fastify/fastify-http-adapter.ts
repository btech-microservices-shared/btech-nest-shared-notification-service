/// <reference path="./fastify-extension.d.ts"/>

import compression from '@fastify/compress'
import { HttpServer } from '@nestjs/common'
import { AbstractHttpAdapter } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { HeaderValuesExtractor } from '../../core/header-values/header-values-extractor'
import { HealtcheckResult } from '../core/healtcheck-result'
import { HttpAdapter } from '../core/http-adapter'
import { HEALTHCHECK_PATH } from '../http.constants'
import { FastifyHeaderValues } from './fastify-header-values'
import { FastifyHeaderValuesExtractor } from './fastify-header-values-extractor'

export class FastifyHttpAdapter extends HttpAdapter {
	protected headerValuesExtractor: HeaderValuesExtractor<FastifyRequest, FastifyHeaderValues> = new FastifyHeaderValuesExtractor()

	getAbstractHttpAdapter(): AbstractHttpAdapter<any, any, any> {
		return new FastifyAdapter({
			bodyLimit: 1024 * 1024 * 20,
			logger: false,
			ignoreTrailingSlash: true
		})
	}
	async setup(httpServer: HttpServer<any, any>): Promise<void> {
		const fastify = httpServer.getInstance() as FastifyInstance

		await fastify.register(compression, { encodings: ['gzip', 'deflate'] })

		fastify.get('/', (_, reply) => {
			reply.redirect('./swagger')
		})

		fastify.get('/swagger/static/index.html', (_, reply) => {
			reply.redirect('./swagger')
		})

		fastify.get(HEALTHCHECK_PATH, (request, reply) => {
			reply.send(HealtcheckResult.ok())
		})

		// fastify.addHook('preHandler', (request, reply, done) => {
		// 	const headerValues = this.headerValuesExtractor.extract(request)

		// 	request.headerValues = headerValues
		// 	request.logger = LoggerFactory.create(headerValues.transactionId)

		// 	done()
		// })
	}
}

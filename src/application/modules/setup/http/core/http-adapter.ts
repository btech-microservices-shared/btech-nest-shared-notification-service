import { HttpServer } from '@nestjs/common'
import { AbstractHttpAdapter } from '@nestjs/core'
import { HeaderValuesExtractor } from '../../core/header-values/header-values-extractor'

export abstract class HttpAdapter {
	protected abstract readonly headerValuesExtractor: HeaderValuesExtractor // TODO: quitar

	abstract getAbstractHttpAdapter(): AbstractHttpAdapter

	abstract setup(httpServer: HttpServer<any, any>): Promise<void>
}

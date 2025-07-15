import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { HeaderValuesExtractorMapping } from '../../core/header-values/header-values-extractor-mapping'
import { FastifyHeaderValuesExtractor } from './fastify-header-values-extractor'

@Module({})
export class FastifyModule implements OnApplicationBootstrap {
	constructor(private readonly headerValuesExtractorMapping: HeaderValuesExtractorMapping) {}

	onApplicationBootstrap(): void {
		this.headerValuesExtractorMapping.register('http', new FastifyHeaderValuesExtractor())
	}
}

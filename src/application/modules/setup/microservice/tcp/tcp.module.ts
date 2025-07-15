import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { TcpContext } from '@nestjs/microservices'
import { HeaderValuesExtractorMapping } from '../../core/header-values/header-values-extractor-mapping'
import { TcpHeaderValuesExtractor } from './tcp-header-values-extractor'

@Module({})
export class AriTcpModule implements OnApplicationBootstrap {
	constructor(private readonly headerValuesExtractorMapping: HeaderValuesExtractorMapping) {}

	onApplicationBootstrap(): void {
		this.headerValuesExtractorMapping.register(TcpContext.name, new TcpHeaderValuesExtractor())
	}
}

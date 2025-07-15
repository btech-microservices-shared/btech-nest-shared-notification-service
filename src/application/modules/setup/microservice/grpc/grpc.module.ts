import { Metadata } from '@grpc/grpc-js'
import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { ErrorFilterTransformModule } from '../../core/error-filter-transform/error-filter-transaform.module'
import { ErrorFilterTransformMapping } from '../../core/error-filter-transform/error-filter-transform-mapping'
import { HeaderValuesExtractorMapping } from '../../core/header-values/header-values-extractor-mapping'
import { GrpcErrorTransform } from './error-filter/error-filter.transform'
import { GrpcHeaderValuesExtractor } from './grpc-header-values-extractor'

@Module({
	imports: [ErrorFilterTransformModule]
})
export class AriGrpcModule implements OnApplicationBootstrap {
	constructor(private readonly headerValuesExtractorMapping: HeaderValuesExtractorMapping, private readonly errorFilterTransformModule: ErrorFilterTransformMapping) {}

	onApplicationBootstrap(): void {
		this.headerValuesExtractorMapping.register(Metadata.name, new GrpcHeaderValuesExtractor())
		this.errorFilterTransformModule.register('grpc', new GrpcErrorTransform())
	}
}

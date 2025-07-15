import { Global, Module } from '@nestjs/common'
import { ErrorFilterTransformMapping } from './error-filter-transform-mapping'

@Global()
@Module({
	providers: [ErrorFilterTransformMapping],
	exports: [ErrorFilterTransformMapping]
})
export class ErrorFilterTransformModule {}

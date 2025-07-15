import { Module } from '@nestjs/common'
import { RequestScopeContextModule } from '../request-scope-context/request-scope-context.module'
import { HeaderValuesExtractorMapping } from './header-values-extractor-mapping'
import { headerValuesProvider } from './header-values.providers'

@Module({
	imports: [RequestScopeContextModule],
	providers: [HeaderValuesExtractorMapping, headerValuesProvider],
	exports: [HeaderValuesExtractorMapping, headerValuesProvider]
})
export class HeaderValuesModule {}

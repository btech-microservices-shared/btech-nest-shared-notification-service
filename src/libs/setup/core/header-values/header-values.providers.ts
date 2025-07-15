import { Provider, Scope } from '@nestjs/common'
import { RequestScopeContext } from '../request-scope-context/request-scope-context'
import { HeaderValues } from './header-values'
import { HeaderValuesExtractorMapping } from './header-values-extractor-mapping'

export const headerValuesProvider: Provider<HeaderValues> = {
	provide: HeaderValues,
	scope: Scope.REQUEST,
	inject: [RequestScopeContext, HeaderValuesExtractorMapping],
	useFactory: (requestScopeContext: RequestScopeContext, headerValuesExtractorMapping: HeaderValuesExtractorMapping): HeaderValues => {
		try {
			switch (true) {
				case requestScopeContext.isHttp():
					return headerValuesExtractorMapping.get('http').process(requestScopeContext.getHttpRequest())

				case requestScopeContext.isRcp():
					const rcpContext = requestScopeContext.getRcpRequestContext()
					const contextName = rcpContext.getContext().constructor.name
					// console.log('contextName', headerValuesExtractorMapping.get(contextName))

					return headerValuesExtractorMapping.get(contextName).process(rcpContext)

				default:
					return null
			}
		} catch (error) {
			if (error instanceof TypeError) {
				console.log('isHttp? %o, isRcp? %o', requestScopeContext.isHttp(), requestScopeContext.isRcp())
				console.log('REVISAR -> ', requestScopeContext.request)
			}

			throw error
		}
	}
}

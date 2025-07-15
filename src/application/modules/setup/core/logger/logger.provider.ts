import { FactoryProvider, Scope, ValueProvider } from '@nestjs/common'
import { PACKAGE_JSON } from 'src/libs/common/utils/package-json'

import { LoggerFactory } from 'src/libs/core/logger'
import { HeaderValues } from '../header-values/header-values'
import { RequestLogger } from './tokens/request-logger'

export function createRequestLoggerProvider(): FactoryProvider<RequestLogger> {
	return {
		provide: RequestLogger,
		scope: Scope.REQUEST,
		inject: [HeaderValues],
		useFactory: (headerValues: HeaderValues) => {
			return LoggerFactory.create(headerValues.transactionId)
		}
	}
}

export function createStaticRequestLoggerProvider(): ValueProvider<RequestLogger> {
	return {
		provide: RequestLogger,
		useValue: LoggerFactory.create(PACKAGE_JSON.name)
	}
}

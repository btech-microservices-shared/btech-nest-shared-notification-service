import { DynamicModule, Module, Scope } from '@nestjs/common'
import { LoggerModuleOptions } from './interface/logger-module-options.interface'
import { createRequestLoggerProvider, createStaticRequestLoggerProvider } from './logger.provider'

// @Global()
@Module({
	// providers: [requestLoggerProvider],
	// exports: [requestLoggerProvider]
})
export class LoggerModule {
	static forRoot(options: LoggerModuleOptions): DynamicModule {
		const loggerModule: DynamicModule = {
			global: true,
			module: LoggerModule,
			providers: [],
			exports: []
		}

		switch (options.scope) {
			case Scope.REQUEST:
			case Scope.TRANSIENT:
				const requestLoggerProvider = createRequestLoggerProvider()

				loggerModule.providers.push(requestLoggerProvider)
				loggerModule.exports.push(requestLoggerProvider)
				break

			case Scope.DEFAULT: {
				const staticRequestLoggerProvider = createStaticRequestLoggerProvider()

				loggerModule.providers.push(staticRequestLoggerProvider)
				loggerModule.exports.push(staticRequestLoggerProvider)
				break
			}
		}

		return loggerModule
	}
}

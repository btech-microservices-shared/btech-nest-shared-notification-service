import { LogLevel } from '@nestjs/common'
import { cosmiconfigSync } from 'cosmiconfig'
import { PACKAGE_JSON } from 'src/libs/common/utils/package-json'
import { LoggerFactory, LoggerServiceConstructor } from 'src/libs/core/logger'
import { ConfigServiceFactory } from 'src/libs/infrastructure/config'
import { isSet, isUnset } from 'src/libs/lib/utils'
import { DefaultLogger } from './default-logger'

let loggerClass: LoggerServiceConstructor = undefined

const staticConfig = cosmiconfigSync(PACKAGE_JSON.name).search()

if (isSet(staticConfig) && !staticConfig.isEmpty) {
	try {
		const { loggerProvider } = staticConfig.config

		if (isSet(loggerProvider)) {
			const loggerProviderPackageName = `@arisale/${loggerProvider}`

			loggerClass = require(loggerProviderPackageName).loggerImplementation

			if (isUnset(loggerClass)) {
				throw new Error(`package ${loggerProviderPackageName} must export variable "loggerImplementation" that points to "LoggerServiceConstructor" type`)
			}
		}
	} catch (error) {
		console.warn(error.message, error.stack)
	}
}

if (isUnset(loggerClass)) {
	const logLevels = ConfigServiceFactory.create().get('LOG_LEVELS', 'log,error,warn,debug,verbose').split(',') as LogLevel[]
	LoggerFactory.setLogLevels(logLevels)

	loggerClass = DefaultLogger
}

LoggerFactory.setLoggerClass(loggerClass)

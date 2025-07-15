import { isFunction, isSet } from 'src/libs/lib/utils'
import { LoggerService, LoggerServiceConstructor } from './logger-service'

let loggerCtor: LoggerServiceConstructor = undefined

export class LoggerFactory {
	private static logLevels: unknown = undefined

	static setLogLevels(levels: unknown): void {
		this.logLevels = levels
	}

	static setLoggerClass(loggerClass: LoggerServiceConstructor) {
		loggerCtor = loggerClass
	}

	static create(context: string | Function): LoggerService {
		if (isFunction(context) && context instanceof Function) {
			context = context.name
		}

		const logger = new loggerCtor(context)

		if (isSet(this.logLevels)) {
			logger.setLogLevels(this.logLevels)
		}

		return logger
	}
}

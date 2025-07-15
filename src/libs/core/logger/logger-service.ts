export interface LoggerServiceConstructor {
	new (...args: any): LoggerService
}

export abstract class LoggerService {
	readonly context?: string

	abstract log(message: any, ...optionalParams: any[]): void
	abstract error(message: any, ...optionalParams: any[]): void
	abstract warn(message: any, ...optionalParams: any[]): void
	abstract debug?(message: any, ...optionalParams: any[]): void
	abstract verbose?(message: any, ...optionalParams: any[]): void
	abstract setLogLevels?(levels: unknown): void
}

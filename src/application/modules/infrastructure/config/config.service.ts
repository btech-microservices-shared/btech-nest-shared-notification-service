import { ENVIRONMENT } from './config.constants'

export abstract class ConfigService {
	get isDev(): boolean {
		return ENVIRONMENT === 'development'
	}
	get isProd(): boolean {
		return ENVIRONMENT === 'production'
	}
	get environment(): string {
		return ENVIRONMENT
	}
	get environmentLowerCase(): string {
		return ENVIRONMENT?.toLowerCase() ?? ''
	}

	abstract get(key: string, defaultValue?: string): string
	abstract getAndCheck(key: string, defaultValue?: string): string
	abstract getNumber(key: string, defaultValue?: number): number
	abstract getNumberAndCheck(key: string, defaultValue?: number): number
	abstract getBoolean(key: string, defaultValue?: boolean): boolean
	abstract getBooleanAndCheck(key: string, defaultValue?: boolean): boolean
}

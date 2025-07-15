import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { isSet, isUnset } from 'src/libs/lib/utils'
import { ENVIRONMENT } from './config.constants'
import { ConfigService } from './config.service'
import { ConfigModuleOptions } from './interfaces/config-module-options.interface'

export class ConfigImplService extends ConfigService {
	private readonly envConfig: Record<string, string> = {}
	constructor(options?: ConfigModuleOptions) {
		super()

		if (isSet(options.filePath) && fs.existsSync(options?.filePath)) {
			this.envConfig = dotenv.parse(fs.readFileSync(options.filePath))
		}
	}

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

	get(key: string, defaultValue?: string): string {
		return this.envConfig[key] ?? process.env[key] ?? defaultValue ?? null
	}

	getAndCheck(key: string, defaultValue?: string): string {
		const value = this.get(key, defaultValue)

		if (isUnset(value)) {
			throw new Error(`Missing environment variable: ${key}`)
		}

		return value
	}

	getNumber(key: string, defaultValue?: number): number {
		let value: string = this.get(key)

		if (isSet(value)) {
			let numberValue = Number(value)

			if (isNaN(numberValue)) {
				throw new Error(`value '${value}' is not a number`)
			}

			return numberValue
		}

		return defaultValue
	}

	getNumberAndCheck(key: string, defaultValue?: number): number {
		const value = this.getNumber(key, defaultValue)

		if (isUnset(value)) {
			throw new Error(`Missing environment variable: ${key}`)
		}

		return value
	}

	getBoolean(key: string, defaultValue?: boolean): boolean {
		let value = this.get(key)

		if (value) {
			switch (value.toLowerCase()) {
				case 'true':
					return true
				case 'false':
					return false
				default:
					throw new Error(`value '${value}' is not a boolean`)
			}
		}

		return defaultValue
	}

	getBooleanAndCheck(key: string, defaultValue?: boolean): boolean {
		const value = this.getBoolean(key, defaultValue)

		if (isUnset(value)) {
			throw new Error(`Missing environment variable: ${key}`)
		}

		return value
	}
}

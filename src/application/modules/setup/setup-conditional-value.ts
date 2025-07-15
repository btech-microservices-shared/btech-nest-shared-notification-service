import { isFunction, isUnset } from '../lib/utils'

export class SetupConditionalValue {
	private readonly value?: string

	constructor(valueExtractor: () => string) {
		if (!isFunction(valueExtractor)) {
			throw new TypeError(`${this.constructor.name}: invalid value for valueExtractor parameter!`)
		}

		this.value = valueExtractor()
	}

	static fromArgv(argumentName: string): SetupConditionalValue {
		return new SetupConditionalValue(() => {
			const argumentNameIndex = process.argv.findIndex(value => argumentName)
			return argumentNameIndex > -1 ? process.argv[argumentNameIndex + 1] : undefined
		})
	}

	static fromEnv(variableName: string): SetupConditionalValue {
		return new SetupConditionalValue(() => {
			return process.env[variableName] ?? undefined
		})
	}

	ensureExistence(): void {
		if (isUnset(this.value)) {
			throw new TypeError(`${this.constructor.name}: value can not be undefined or null`)
		}
	}

	is(matchingValue: string): boolean {
		return this.value === matchingValue
	}

	valueOf(): string {
		return this.value
	}

	toString(): string {
		return this.value
	}
}

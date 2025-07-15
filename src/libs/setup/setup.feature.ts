import { Type } from '@nestjs/common'
import { isUnset } from '../lib/utils'
import { SetupConditionalValue } from './setup-conditional-value'

export type SetupFeatureOutput = {
	featureModule: Type<any>
}

export class SetupFeature<T extends SetupFeatureOutput = SetupFeatureOutput> {
	private readonly setupConditionalValue = SetupConditionalValue.fromEnv('SETUP_FEATURE')
	private readonly output: T

	constructor(factory: (value: string) => T) {
		this.output = factory(this.setupConditionalValue.valueOf())

		if (isUnset(this.output)) {
			throw new Error(`no feature configured for ${this.setupConditionalValue}.`)
		}
	}

	valueOf(): T {
		return this.output
	}

	toString(): string {
		return JSON.stringify(this.output)
	}
}

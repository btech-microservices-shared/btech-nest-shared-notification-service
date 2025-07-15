import { isSet, isUnset } from 'src/libs/lib/utils'
import { LazyDependency } from './lazy-dependency'

export abstract class FactoryDependency<T> extends LazyDependency<T> {
	private dependency: T = null

	constructor(private readonly factory: () => T) {
		super()
	}

	get(): T {
		if (isUnset(this.dependency)) {
			this.dependency = this.factory()
		}

		return this.dependency
	}

	exists(): boolean {
		return isSet(this.dependency)
	}

	reset(): this {
		this.dependency = null

		return this
	}
}

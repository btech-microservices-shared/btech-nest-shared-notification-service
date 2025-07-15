import { FactoryDependency } from './factory-dependency'

export abstract class FactoryLazyDependency<T> extends FactoryDependency<T> {
	constructor() {
		super(() => this.build())
	}

	protected abstract build(): T
}

export abstract class LazyDependency<T> {
	abstract get(): T
	abstract exists(): boolean
}

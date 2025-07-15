export interface ExecuteConsoleApplication<TResult = void> {
	execute(args?: string[]): Promise<TResult>
}

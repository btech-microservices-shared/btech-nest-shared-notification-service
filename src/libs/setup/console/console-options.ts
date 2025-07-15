export interface ConsoleOptions {
	/**
	 * close application after execution on ExecuteConsoleApplication.execute() method
	 */
	autoClose?: boolean

	/**
	 * Use request scope for "Request" scoped providers used in program
	 */
	useRequestScope?: boolean
}

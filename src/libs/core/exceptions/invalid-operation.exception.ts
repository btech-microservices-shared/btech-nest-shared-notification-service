import { BaseException } from './base.exception'

export class InvalidOperationException extends BaseException {
	constructor(
		message?: string,
		public readonly code?: number,
		public readonly data?: Record<string, any>
	) {
		super(message)
	}
}

import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'

export class ConflictExceptionWithCode extends HttpException {
	constructor(message: string, code: number, data: Record<string, any> = {}) {
		super({ statusCode: HttpStatus.CONFLICT, error: ConflictException.name, message, code, data }, HttpStatus.CONFLICT)
	}
}

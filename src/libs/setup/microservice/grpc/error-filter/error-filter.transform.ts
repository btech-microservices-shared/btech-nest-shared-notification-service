import { status as GrpcStatus } from '@grpc/grpc-js'
import { BadRequestException, ForbiddenException, GatewayTimeoutException, HttpException, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InvalidOperationException } from 'src/libs/core/exceptions'
import { isObject, isSet, isUnset } from 'src/libs/lib/utils'
import { ErrorFilterTransform } from 'src/libs/setup/core/error-filter-transform/error-filter-transform'

export class GrpcErrorTransform implements ErrorFilterTransform {
	private readonly logger = new Logger(GrpcErrorTransform.name)

	transform(error: any): any {
		const isHttpException = error instanceof HttpException
		const status: typeof GrpcStatus = require('@grpc/grpc-js').status

		if (isHttpException) {
			if (isUnset(error.getResponse().status) && isObject(error.getResponse())) {
				error.response.statusCode = error['status'] ?? undefined
			}

			if (isUnset(error.response.code) && isObject(error.response)) {
				error.response.code = error.response['responseCode'] || error['code'] || 2
			}

			return error
		}

		let operationCode = error['code']

		if (isSet(error.metadata)) {
			operationCode = error.metadata.get('code').shift()
		}

		switch (error['code']) {
			case status.INVALID_ARGUMENT:
				error = new BadRequestException(error.details)
				break
			case status.UNAUTHENTICATED:
				error = new UnauthorizedException(error.details)
				break
			case status.PERMISSION_DENIED:
				error = new ForbiddenException(error.details)
				break
			case status.NOT_FOUND:
				error = new NotFoundException(error.details)
				break
			case status.ABORTED:
				error = new InvalidOperationException(error.details, operationCode)
				break
			case status.DEADLINE_EXCEEDED:
				error = new GatewayTimeoutException(error.details)
				break
			case status.UNKNOWN:
			default:
				error = new InternalServerErrorException(error.message, operationCode)
				break
		}

		return error
	}
}

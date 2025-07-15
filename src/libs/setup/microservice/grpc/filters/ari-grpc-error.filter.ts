import type { Metadata as GrpcMetadata, status as GrpcStatus } from '@grpc/grpc-js'
import { ArgumentsHost, Catch, HttpStatus, Inject, RpcExceptionFilter } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { isSet } from 'src/libs/lib/utils'
import { ErrorFilterTransformMapping } from '../../../core/error-filter-transform/error-filter-transform-mapping'
import { ApplicationErrorFilter } from '../../../core/filters/application-error.filter'

@Catch()
export class AriGrpcErrorFilter extends ApplicationErrorFilter implements RpcExceptionFilter<Error> {
	constructor(@Inject(ErrorFilterTransformMapping) private readonly errorTransformationFilterMapping: ErrorFilterTransformMapping) {
		super()
	}

	catch(exception: Error, host: ArgumentsHost): Observable<any> {
		const process = this.errorTransformationFilterMapping.get('grpc')
		if (isSet(process)) {
			exception = process.transform(exception)
		}

		const { error } = this.buildError(exception)

		const Metadata: typeof GrpcMetadata = require('@grpc/grpc-js').Metadata
		const status: typeof GrpcStatus = require('@grpc/grpc-js').status

		const newError = {
			code: 0,
			message: error.message + ', ' + exception.stack,
			details: error.message,
			metadata: new Metadata()
		}

		switch (error.statusCode) {
			case HttpStatus.BAD_REQUEST:
				newError.code = status.INVALID_ARGUMENT
				break

			case HttpStatus.UNAUTHORIZED:
				newError.code = status.UNAUTHENTICATED
				break

			case HttpStatus.FORBIDDEN:
				newError.code = status.PERMISSION_DENIED
				break

			case HttpStatus.NOT_FOUND:
				newError.code = status.NOT_FOUND
				break

			case HttpStatus.CONFLICT:
				newError.code = status.ABORTED
				break

			case HttpStatus.SERVICE_UNAVAILABLE:
				newError.code = status.UNAVAILABLE
				break

			case HttpStatus.GATEWAY_TIMEOUT:
				newError.code = status.DEADLINE_EXCEEDED
				break

			case HttpStatus.INTERNAL_SERVER_ERROR:
			default:
				newError.code = status.UNKNOWN
				break
		}

		if (isSet(error.code)) {
			newError.metadata.set('code', error.code.toString())
		}

		if (isSet(error.data)) {
			for (const [key, value] of Object.entries(error.data)) {
				newError.metadata.set(key, String(value))
			}
		}

		// console.log(error)
		console.log(newError.metadata)

		return throwError(() => newError)
	}
}

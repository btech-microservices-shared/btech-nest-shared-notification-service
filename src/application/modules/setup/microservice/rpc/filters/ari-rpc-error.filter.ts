import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { ApplicationErrorFilter } from '../../../core/filters/application-error.filter'

@Catch()
export class AriRpcErrorFilter extends ApplicationErrorFilter implements RpcExceptionFilter<Error> {
	catch(exception: Error, host: ArgumentsHost): Observable<any> {
		const { error } = this.buildError(exception)

		return throwError(() => error)
	}
}

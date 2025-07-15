import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { BaseRpcContext, RequestContext } from '@nestjs/microservices'
import { IncomingMessage } from 'http'
import { isFunction, isSet } from 'src/libs/lib/utils'

type Request = RequestContext & Pick<IncomingMessage, 'headers'>

@Injectable({ scope: Scope.REQUEST })
export class RequestScopeContext {
	constructor(@Inject(REQUEST) public readonly request: Request) {}

	isRcp(): boolean {
		return isFunction(this.request?.getContext)
	}

	isHttp(): boolean {
		return isSet(this.request?.headers)
	}

	getHttpRequest<T = IncomingMessage>(): T {
		return this.request as T
	}

	getRcpRequestContext<TData = any, TContext extends BaseRpcContext = BaseRpcContext>(): RequestContext<TData, TContext> {
		return this.request as RequestContext
	}
}

import { Module } from '@nestjs/common'
import { RequestScopeContext } from './request-scope-context'

@Module({
	providers: [RequestScopeContext],
	exports: [RequestScopeContext]
})
export class RequestScopeContextModule {}

import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { FastifyModule } from './fastify/fastify.module'
import { AriHttpErrorFilter } from './filters/ari-http-error.filter'
import { HttpLoggingInterceptor } from './interceptors/http-logging.interceptor'

@Global()
@Module({
	imports: [FastifyModule],
	providers: [
		AriHttpErrorFilter,
		{
			provide: APP_INTERCEPTOR,
			useClass: HttpLoggingInterceptor
		}
	]
})
export class HttpSetupModule {}

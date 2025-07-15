import { Global, Module, Scope } from '@nestjs/common'
import { ConfigModule } from 'src/libs/infrastructure/config'
import { HeaderValuesModule } from './header-values/header-values.module'
import { LoggerModule } from './logger/logger.module'
import { AriValidationPipe } from './pipes/ari-validation.pipe'
import { RequestScopeContextModule } from './request-scope-context/request-scope-context.module'

@Global()
@Module({
	imports: [ConfigModule, RequestScopeContextModule, HeaderValuesModule, LoggerModule.forRoot({ scope: Scope.REQUEST })],
	providers: [AriValidationPipe],
	exports: [RequestScopeContextModule, HeaderValuesModule]
})
export class CoreSetupModule {}

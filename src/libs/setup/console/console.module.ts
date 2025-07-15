import { DynamicModule, Module, Scope } from '@nestjs/common'
import { ConfigModule } from 'src/libs/infrastructure/config'
import { LoggerModule } from '../core/logger/logger.module'

@Module({})
export class ConsoleModule {
	static forRoot(appModule: any): DynamicModule {
		return {
			module: ConsoleModule,
			imports: [ConfigModule, LoggerModule.forRoot({ scope: Scope.DEFAULT }), appModule]
		}
	}
}

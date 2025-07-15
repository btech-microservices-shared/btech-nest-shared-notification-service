import { DynamicModule, Module } from '@nestjs/common'
import { CoreSetupModule } from '../core/core-setup.module'
import { HttpSetupModule } from '../http/http-setup.module'
import { RpcSetupModule } from '../microservice/rpc/rpc-setup.module'

@Module({})
export class HybridModule {
	static forRoot(appModule: any): DynamicModule {
		return {
			module: HybridModule,
			imports: [CoreSetupModule, HttpSetupModule, RpcSetupModule, appModule]
		}
	}
}

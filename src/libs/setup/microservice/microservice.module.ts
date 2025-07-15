import { DynamicModule, Module } from '@nestjs/common'
import { CoreSetupModule } from '../core/core-setup.module'
import { RpcSetupModule } from './rpc/rpc-setup.module'

@Module({})
export class MicroserviceModule {
	static forRoot(appModule: any): DynamicModule {
		return {
			module: MicroserviceModule,
			imports: [CoreSetupModule, RpcSetupModule, appModule]
		}
	}
}

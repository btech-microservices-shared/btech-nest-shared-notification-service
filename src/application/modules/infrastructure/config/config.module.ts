import { Global, Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './config.module-definition'
import { configServiceProvider } from './config.providers'

@Global()
@Module({
	providers: [configServiceProvider],
	exports: [configServiceProvider]
})
export class ConfigModule extends ConfigurableModuleClass {}

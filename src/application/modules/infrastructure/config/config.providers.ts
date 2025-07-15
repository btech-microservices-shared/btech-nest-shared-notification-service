import { Provider } from '@nestjs/common'
import { ConfigServiceFactory } from './config-service-factory'
import { MODULE_OPTIONS_TOKEN } from './config.module-definition'
import { ConfigService } from './config.service'
import { ConfigModuleOptions } from './interfaces/config-module-options.interface'

export const configServiceProvider: Provider<ConfigService> = {
	provide: ConfigService,
	inject: [{ token: MODULE_OPTIONS_TOKEN, optional: true }],
	useFactory: (options?: ConfigModuleOptions) => {
		return ConfigServiceFactory.create(options)
	}
}

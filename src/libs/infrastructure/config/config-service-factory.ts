import { ConfigImplService } from './config-impl.service'
import { DEFAULT_FILE_PATH } from './config.constants'
import { ConfigService } from './config.service'
import { ConfigModuleOptions } from './interfaces/config-module-options.interface'

export class ConfigServiceFactory {
	static create(options?: ConfigModuleOptions): ConfigService {
		return new ConfigImplService(options ?? { filePath: DEFAULT_FILE_PATH })
	}
}

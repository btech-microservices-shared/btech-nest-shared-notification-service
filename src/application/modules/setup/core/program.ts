import { INestApplicationContext } from '@nestjs/common'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { LoggerFactory, LoggerService } from 'src/libs/core/logger'
import { ConfigServiceFactory } from 'src/libs/infrastructure/config'
import { isUnset } from 'src/libs/lib/utils'
export abstract class Program<TOptions extends NestApplicationContextOptions = NestApplicationContextOptions, TAppContext extends INestApplicationContext = INestApplicationContext> {
	protected readonly logger: LoggerService = LoggerFactory.create(this.constructor.name)
	protected readonly configService = ConfigServiceFactory.create()

	protected app: TAppContext = null

	protected abstract getNestJsOptions(): TOptions
	protected abstract createNestJsApp(appModule: any): Promise<void>
	protected abstract setup(): Promise<void>
	protected abstract start(): Promise<void>

	async run(appModule: any): Promise<void> {
		try {
			await this.createNestJsApp(appModule)

			if (isUnset(this.app)) {
				throw new Error(`please ensure that property "app" of this instance is set inside method createNestJsApp()!`)
			}

			await this.setup()
			await this.start()
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	}
}

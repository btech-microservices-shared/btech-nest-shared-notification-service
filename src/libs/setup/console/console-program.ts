import { Type } from '@nestjs/common'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { ContextIdFactory, NestFactory } from '@nestjs/core'
import { Program } from '../core/program'
import { ConsoleModule } from './console.module'
import { ExecuteConsoleApplication } from './execute-console-application.interface'

export type ConsoleProgramOptions = {
	typeOrToken: Type<ExecuteConsoleApplication> | Function | string | symbol

	/**
	 * close application after execution on ExecuteConsoleApplication.execute() method
	 */
	autoClose?: boolean

	/**
	 * Use request scope for "Request" scoped providers used in program
	 */
	useRequestScope?: boolean
}

export class ConsoleProgram extends Program {
	constructor(private readonly options?: ConsoleProgramOptions) {
		super()
	}

	getNestJsOptions(): NestApplicationContextOptions {
		return {
			logger: this.logger
		}
	}

	protected async createNestJsApp(appModule: any): Promise<void> {
		this.app = await NestFactory.createApplicationContext(ConsoleModule.forRoot(appModule), this.getNestJsOptions())
	}

	async setup(): Promise<void> {
		this.app.enableShutdownHooks()
	}

	protected async start(): Promise<void> {
		await this.app.init()

		let consoleApplication: ExecuteConsoleApplication = undefined

		if (this.options?.useRequestScope === true) {
			const contextId = ContextIdFactory.create()
			this.logger.debug(`contextId -> ${JSON.stringify(contextId)}`)
			this.logger.debug('using app.resolve()')
			consoleApplication = await this.app.resolve<ExecuteConsoleApplication>(this.options.typeOrToken, contextId)
		} else {
			this.logger.debug('using app.get()')
			consoleApplication = this.app.get<ExecuteConsoleApplication>(this.options.typeOrToken)
		}

		await consoleApplication?.execute(process.argv)

		if (this.options.autoClose === true) {
			await this.app.close()

			process.exit(0)
		}
	}
}

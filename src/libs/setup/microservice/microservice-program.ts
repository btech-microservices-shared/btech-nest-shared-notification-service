import { INestMicroservice } from '@nestjs/common'
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { isBoolean, isSet, isUnset } from 'src/libs/lib/utils'
import { AriValidationPipe } from '../core/pipes/ari-validation.pipe'
import { ServerProgram } from '../core/server-program'
import { MicroserviceConnection } from './microservice-connection'
import { MicroserviceType } from './microservice-type'
import { MicroserviceModule } from './microservice.module'

export type MicroserviceProgramCoreOptions = {
	/**
	 * Use "AriValidationPipe"
	 */
	registerGlobalPipe?: boolean

	/**
	 * Use "token" returned from "microserviceConnection.getErrorFilterTypeOrToken()" method
	 */
	registerGlobalFilter?: boolean
}

export type MicroserviceProgramConnectionOptions<TConnectionOptions = unknown> = {
	connectionOptions?: TConnectionOptions
}

export type MicroserviceProgramOptions<TConnectionOptions> = MicroserviceProgramCoreOptions & MicroserviceProgramConnectionOptions<TConnectionOptions>

export abstract class MicroserviceProgram<TConnectionOptions, TMicroserviceType = MicroserviceType> extends ServerProgram<NestMicroserviceOptions & MicroserviceOptions, INestMicroservice> {
	protected abstract readonly microserviceConnection: MicroserviceConnection
	protected abstract readonly microserviceType: TMicroserviceType

	constructor(protected readonly options: MicroserviceProgramOptions<TConnectionOptions>) {
		super()

		if (isUnset(this.options)) {
			throw new Error('missing options')
		}

		if (!isBoolean(this.options.registerGlobalPipe)) {
			this.options.registerGlobalPipe = true
		}

		if (!isBoolean(this.options.registerGlobalFilter)) {
			this.options.registerGlobalFilter = true
		}
	}

	protected getNestJsOptions(): NestApplicationContextOptions & MicroserviceOptions {
		const nestJsOptions = this.microserviceConnection.getNestJsOptions()
		nestJsOptions.logger = this.logger

		return nestJsOptions
	}

	protected async createNestJsApp(appModule: any): Promise<void> {
		this.app = await NestFactory.createMicroservice(MicroserviceModule.forRoot(appModule), this.getNestJsOptions())
	}

	protected async setup(): Promise<void> {
		this.app.enableShutdownHooks()

		if (this.options.registerGlobalPipe) {
			this.app.useGlobalPipes(this.app.get(AriValidationPipe))
		}

		if (this.options.registerGlobalFilter) {
			const errorFilterTypeOrToken = this.microserviceConnection.getErrorFilterTypeOrToken()

			if (isSet(errorFilterTypeOrToken)) {
				this.app.useGlobalFilters(this.app.get(errorFilterTypeOrToken))
			}
		}
	}

	protected async start(): Promise<void> {
		await this.app.listen()

		this.logger.log(this.microserviceConnection.getStartLog())

		this.logNameAndVersion()
		this.notifyReady()
	}
}

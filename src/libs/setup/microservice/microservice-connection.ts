import { Type } from '@nestjs/common'
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface'
import { MicroserviceOptions } from '@nestjs/microservices'
import { ConfigService } from 'src/libs/infrastructure/config'
import { ErrorFilter } from '../core/filters/error.filter'

export abstract class MicroserviceConnection {
	constructor(protected readonly configService: ConfigService) {}

	abstract get hasMicroservice(): boolean
	abstract getNestJsOptions(): NestMicroserviceOptions & MicroserviceOptions
	abstract getStartLog(): string
	abstract getErrorFilterTypeOrToken(): Type<ErrorFilter>
}

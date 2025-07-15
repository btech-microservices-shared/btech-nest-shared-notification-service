import { Type } from '@nestjs/common'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { GrpcOptions, MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'node:path'
import { ConfigService } from 'src/libs/infrastructure/config'
import { isSet, isUnset } from 'src/libs/lib/utils'
import { ErrorFilter } from '../../core/filters/error.filter'
import { MicroserviceConnection } from '../microservice-connection'
import { AriGrpcErrorFilter } from './filters/ari-grpc-error.filter'
import { GRPC_HOST_KEY, GRPC_PORT_KEY } from './grpc.constants'

export type GrpcMicroserviceConnectionOptions = Omit<GrpcOptions['options'], 'url' | 'protoPath'>

export class GrpcMicroserviceConnection extends MicroserviceConnection {
	private readonly host: string = this.configService.get(GRPC_HOST_KEY)
	private readonly port: number = this.configService.getNumber(GRPC_PORT_KEY)

	constructor(
		configService: ConfigService,
		private readonly options?: GrpcMicroserviceConnectionOptions
	) {
		super(configService)
	}

	get hasMicroservice(): boolean {
		return isSet(this.host) && isSet(this.port)
	}

	getNestJsOptions(): NestApplicationContextOptions & MicroserviceOptions {
		if (isUnset(this.options.package)) {
			throw new Error(`missing option "package"`)
		}

		return {
			transport: Transport.GRPC,
			options: {
				url: `${this.host}:${this.port}`,
				protoPath: join(process.cwd(), './proto/' + (this.options.package as string).split('.')[1] + '.proto'),
				...this.options
			}
		}
	}
	getStartLog(): string {
		return `listening gRPC at host: ${this.host}, port: ${this.port}, package: ${this.options.package}`
	}

	getErrorFilterTypeOrToken(): Type<ErrorFilter<Error>> {
		return AriGrpcErrorFilter
	}
}

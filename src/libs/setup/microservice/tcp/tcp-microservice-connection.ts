import { Type } from '@nestjs/common'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from 'src/libs//infrastructure/config'
import { isSet } from 'src/libs//lib/utils'
import { ErrorFilter } from '../../core/filters/error.filter'
import { MicroserviceConnection } from '../microservice-connection'
import { AriRpcErrorFilter } from '../rpc/filters/ari-rpc-error.filter'
import { TCP_HOST_KEY, TCP_PORT_KEY } from './tpc.constants'

export type TcpMicroserviceConnectionOptions = Omit<TcpOptions['options'], 'host' | 'port'>

export class TcpMicroserviceConnection extends MicroserviceConnection {
	private readonly host: string = this.configService.get(TCP_HOST_KEY)
	private readonly port: number = this.configService.getNumber(TCP_PORT_KEY)

	constructor(
		configService: ConfigService,
		private readonly options?: TcpMicroserviceConnectionOptions
	) {
		super(configService)
	}

	get hasMicroservice(): boolean {
		return isSet(this.host) && isSet(this.port)
	}

	getNestJsOptions(): NestApplicationContextOptions & MicroserviceOptions {
		return {
			transport: Transport.TCP,
			options: {
				host: this.host,
				port: this.port,
				...this.options
			}
		}
	}

	getStartLog(): string {
		return `listening TCP at host: ${this.host}, port: ${this.port}`
	}

	getErrorFilterTypeOrToken(): Type<ErrorFilter<Error>> {
		return AriRpcErrorFilter
	}
}

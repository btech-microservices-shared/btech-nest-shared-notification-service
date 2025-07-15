import { MicroserviceConnection } from '../microservice-connection'
import { MicroserviceProgram, MicroserviceProgramConnectionOptions, MicroserviceProgramCoreOptions } from '../microservice-program'
import { MicroserviceType } from '../microservice-type'
import { TcpMicroserviceConnection, TcpMicroserviceConnectionOptions } from './tcp-microservice-connection'

export type TcpMicroserviceProgramOptions = MicroserviceProgramCoreOptions & MicroserviceProgramConnectionOptions<TcpMicroserviceConnectionOptions>

export class TcpMicroserviceProgram extends MicroserviceProgram<TcpMicroserviceConnectionOptions> {
	protected readonly microserviceConnection: MicroserviceConnection = new TcpMicroserviceConnection(this.configService, this.options?.connectionOptions)
	protected readonly microserviceType: MicroserviceType = 'tcp'

	constructor(options?: TcpMicroserviceProgramOptions) {
		super(options ?? {})
	}
}

import { MicroserviceConnection } from '../microservice-connection'
import { MicroserviceProgram, MicroserviceProgramConnectionOptions, MicroserviceProgramCoreOptions } from '../microservice-program'
import { MicroserviceType } from '../microservice-type'
import { GrpcMicroserviceConnection, GrpcMicroserviceConnectionOptions } from './grpc-microservice-connection'

export type GrpcMicroserviceProgramOptions = MicroserviceProgramCoreOptions & MicroserviceProgramConnectionOptions<GrpcMicroserviceConnectionOptions>

export class GrpcMicroserviceProgram extends MicroserviceProgram<GrpcMicroserviceConnectionOptions> {
	protected readonly microserviceConnection: MicroserviceConnection = new GrpcMicroserviceConnection(this.configService, this.options!.connectionOptions)
	protected readonly microserviceType: MicroserviceType = 'grpc'

	constructor(options: GrpcMicroserviceProgramOptions) {
		super(options)
	}
}

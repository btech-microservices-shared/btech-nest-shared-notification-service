import { ConsoleProgram, ConsoleProgramOptions } from './console/console-program'
import { HybridProgram, HybridProgramOptions } from './hybrid/hybrid-program'
import { GrpcMicroserviceProgram, GrpcMicroserviceProgramOptions } from './microservice/grpc/grpc-microservice-program'
import { TcpMicroserviceProgram, TcpMicroserviceProgramOptions } from './microservice/tcp/tcp-microservice-program'

export class SetupFactory {
	static async create(appModule: any, options?: HybridProgramOptions): Promise<void> {
		await new HybridProgram(options).run(appModule)
	}

	static async createTcpMicroservice(appModule: any, options?: TcpMicroserviceProgramOptions): Promise<void> {
		await new TcpMicroserviceProgram(options).run(appModule)
	}

	static async createGrpcMicroservice(appModule: any, options: GrpcMicroserviceProgramOptions): Promise<void> {
		await new GrpcMicroserviceProgram(options).run(appModule)
	}

	static async createConsole(appModule: any, options: ConsoleProgramOptions): Promise<void> {
		await new ConsoleProgram(options).run(appModule)
	}
}

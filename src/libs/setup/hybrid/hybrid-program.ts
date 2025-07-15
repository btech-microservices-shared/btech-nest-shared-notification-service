import { INestApplication, NestApplicationOptions } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ServerResponse } from 'node:http'
import { AriValidationPipe } from '../core/pipes/ari-validation.pipe'
import { ServerProgram } from '../core/server-program'
import { HttpAdapter } from '../http/core/http-adapter'
import { FastifyHttpAdapter } from '../http/fastify/fastify-http-adapter'
import { AriHttpErrorFilter } from '../http/filters/ari-http-error.filter'
import { SwaggerBuilder } from '../http/swagger/swagger-builder'
import { GrpcMicroserviceConnection, GrpcMicroserviceConnectionOptions } from '../microservice/grpc/grpc-microservice-connection'
import { MicroserviceConnection } from '../microservice/microservice-connection'
import { TcpMicroserviceConnection, TcpMicroserviceConnectionOptions } from '../microservice/tcp/tcp-microservice-connection'
import { HybridModule } from './hybrid.module'

export type HybridProgramOptions = {
	tcp?: TcpMicroserviceConnectionOptions
	grpc?: GrpcMicroserviceConnectionOptions
}

export class HybridProgram extends ServerProgram<NestApplicationOptions, INestApplication> {
	private readonly basePath: string = 'api'
	private readonly host: string = this.configService.getAndCheck('HTTP_HOST')
	private readonly port: number = this.configService.getNumberAndCheck('HTTP_PORT')
	private readonly globalPrefix: string = this.configService.get('GLOBAL_PREFIX_SERVICE', '')
	private readonly swaggerBuilder = new SwaggerBuilder(this.configService, this.globalPrefix, this.basePath)
	private readonly httpAdapter: HttpAdapter = new FastifyHttpAdapter()
	private readonly tcpMicroserviceConnection: MicroserviceConnection
	private readonly grpcMicroserviceConnection: MicroserviceConnection

	constructor(private readonly options?: HybridProgramOptions) {
		super()

		this.tcpMicroserviceConnection = new TcpMicroserviceConnection(this.configService, this.options?.tcp)
		this.grpcMicroserviceConnection = new GrpcMicroserviceConnection(this.configService, this.options?.grpc)
	}

	private getGlobalPrefix(): string {
		let globalPrefix = this.globalPrefix.length ? this.globalPrefix + '/' : ''
		return globalPrefix + this.basePath
	}

	protected getNestJsOptions(): NestApplicationOptions {
		return {
			logger: this.logger
		}
	}

	protected async createNestJsApp(appModule: any): Promise<void> {
		this.app = await NestFactory.create(HybridModule.forRoot(appModule), this.httpAdapter.getAbstractHttpAdapter(), this.getNestJsOptions())
	}

	protected async setup(): Promise<void> {
		this.app.use((_, res: ServerResponse, next) => {
			res.setHeader('Access-Control-Expose-Headers', '*')
			next()
		})
		this.app.enableCors()
		this.app.enableShutdownHooks()
		this.app.setGlobalPrefix(this.getGlobalPrefix())
		this.app.useGlobalFilters(this.app.get(AriHttpErrorFilter))
		this.app.useGlobalPipes(this.app.get(AriValidationPipe))

		if (this.tcpMicroserviceConnection?.hasMicroservice) {
			this.app.connectMicroservice(this.tcpMicroserviceConnection.getNestJsOptions())
		}

		if (this.grpcMicroserviceConnection?.hasMicroservice) {
			this.app.connectMicroservice(this.grpcMicroserviceConnection.getNestJsOptions())
		}

		await this.httpAdapter.setup(this.app.getHttpAdapter())

		if (this.swaggerBuilder) {
			this.swaggerBuilder.setup()
			this.swaggerBuilder.build(this.app)
		}
	}

	protected async start(): Promise<void> {
		await this.app.startAllMicroservices()
		await this.app.listen(this.port, this.host)

		let baseAddress = `http://${this.host}:${this.port}`
		let serverAddress = baseAddress

		if (this.globalPrefix.length) {
			serverAddress += '/' + this.globalPrefix
		}

		this.logger.log(`listening at ${serverAddress}`)

		if (this.swaggerBuilder) {
			this.logger.log(this.swaggerBuilder.getStartLog(baseAddress))
		}

		if (this.tcpMicroserviceConnection?.hasMicroservice) {
			this.logger.log(this.tcpMicroserviceConnection.getStartLog())
		}

		if (this.grpcMicroserviceConnection?.hasMicroservice) {
			this.logger.log(this.grpcMicroserviceConnection.getStartLog())
		}

		this.logNameAndVersion()
		this.notifyReady()
	}
}

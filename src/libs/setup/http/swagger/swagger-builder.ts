import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PACKAGE_JSON } from 'src/libs/common/utils/package-json'
import { ConfigService } from 'src/libs/infrastructure/config'

export class SwaggerBuilder {
	private readonly swaggerPath: string = '/swagger'
	private readonly documentBuilder = new DocumentBuilder()
	private readonly useBearerAuth: boolean
	private readonly useApiKeyAuth: boolean
	private readonly swaggerBasePath: string

	constructor(
		private readonly configService: ConfigService,
		private readonly globalPrefix: string,
		private readonly basePath: string
	) {
		this.useBearerAuth = this.configService.getBoolean('USE_BEARER_AUTH', true)
		// this.useApiKeyAuth = this.configService.getBoolean('USE_API_KEY_AUTH', false)
		this.swaggerBasePath = this.configService.get('SWAGGER_BASE_PATH', '/' + this.basePath)
	}

	private getSwaggerPath(): string {
		let globalPrefix = this.globalPrefix.length ? '/' + this.globalPrefix : ''
		return globalPrefix + this.swaggerPath
	}

	setup(): void {
		this.documentBuilder.setTitle(PACKAGE_JSON.name)
		this.documentBuilder.setDescription(PACKAGE_JSON.description)
		this.documentBuilder.setVersion(PACKAGE_JSON.version)
		// this.documentBuilder.setBasePath(this.swaggerBasePath)
		// this.documentBuilder.addServer('/')
		this.documentBuilder.addServer(this.swaggerBasePath)

		if (this.useBearerAuth) {
			this.documentBuilder.addBearerAuth({ type: 'http' })
		}

		// if (this.useApiKeyAuth) {
		// 	this.documentBuilder.addApiKey({ type: 'apiKey' })
		// }
	}

	build(app: INestApplication): void {
		const document = SwaggerModule.createDocument(app, this.documentBuilder.build(), {
			ignoreGlobalPrefix: true
		})

		SwaggerModule.setup(this.getSwaggerPath(), app, document)
	}

	getStartLog(address: string): string {
		let swaggerDocumentationAddress = address

		if (this.globalPrefix.length) {
			swaggerDocumentationAddress += '/' + this.globalPrefix
		}

		swaggerDocumentationAddress += this.swaggerPath + '/'

		return `swagger documentation at ${swaggerDocumentationAddress}`
	}
}

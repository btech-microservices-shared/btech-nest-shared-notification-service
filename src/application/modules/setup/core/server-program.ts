import { INestApplicationContext } from '@nestjs/common'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { PACKAGE_JSON } from 'src/libs/common/utils/package-json'
import { Program } from './program'

export abstract class ServerProgram<
	TOptions extends NestApplicationContextOptions = NestApplicationContextOptions,
	TAppContext extends INestApplicationContext = INestApplicationContext
> extends Program<TOptions, TAppContext> {
	protected notifyReady(): void {
		if (typeof process.send === 'function') {
			process.send('ready')
		}
	}

	protected logNameAndVersion(): void {
		this.logger.log(`${PACKAGE_JSON.name} - ${PACKAGE_JSON.version}`)
	}
}

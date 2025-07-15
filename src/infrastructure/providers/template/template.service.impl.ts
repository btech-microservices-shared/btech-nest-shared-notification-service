import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { promises as fs, readFile, readdir } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import { MessageStyles } from 'src/domain/entities/message-styles.entity'

import * as Handlebars from 'handlebars'
import { TemplateService } from 'src/domain/services/template.service'
import { ThemeService } from 'src/domain/services/theme.service'
import { registerHelpers } from './helpers'

@Injectable()
export class TemplateServiceImpl<T> extends TemplateService<T> implements OnModuleInit {
	#_templates: Map<string, HandlebarsTemplateDelegate> = new Map()
	#_theme: MessageStyles

	constructor(
		private readonly logger: Logger,
		private readonly themeService: ThemeService
	) {
		super()
		this.#_theme = this.themeService.getThemeStyles()
	}

	async onModuleInit() {
		try {
			await this.#_loadPartials()

			await this.#_registerHelpers()

			this.logger.log(`Templates loaded and helpers registered`)
		} catch (error) {
			this.logger.error('Error loading partials:', error)
			throw error
		}
	}

	async renderTemplate(name: string, data: T): Promise<string> {
		this.logger.log(`inside ${this.constructor.name}.${this.renderTemplate.name}`)

		let template: HandlebarsTemplateDelegate

		try {
			if (this.#_templates.has(name)) {
				template = this.#_templates.get(name)
			} else {
				const path = join(process.cwd(), `templates/${name}.hbs`)

				const content = await fs.readFile(path, 'utf-8')
				template = Handlebars.compile(content)
				this.#_templates.set(name, template)
			}

			return template(data)
		} catch (error) {
			this.logger.error(`Error rendering or reading template ${name}`, error)
			throw error
		}
	}

	async #_loadPartials(): Promise<void> {
		const readdirAsync = promisify(readdir)
		const readFileAsync = promisify(readFile)

		try {
			const files = await readdirAsync(join(process.cwd(), 'partials'))

			const partials = await Promise.all(
				files.map(async filename => {
					const buffer = await readFileAsync(join(process.cwd(), 'partials', filename))

					return {
						name: filename.split('.')[0],
						content: buffer.toString('utf8')
					}
				})
			)

			if (partials && partials.length > 0) {
				partials?.forEach(partial => {
					Handlebars.registerPartial(partial.name, partial.content)
				})
			}
		} catch (error) {
			console.error('Error reading partials:', error)
			throw error
		}
	}

	async #_registerHelpers(): Promise<void> {
		registerHelpers(this.#_theme, this.logger)
	}
}

import { Logger } from '@nestjs/common'
import * as Handlebars from 'handlebars'
import { MessageStyles } from 'src/domain/entities/message-styles.entity'

export function registerHelpers(styles: MessageStyles, logger: Logger): void {
	Handlebars.registerHelper('list', function (items, options) {
		const itemsAsHtml = items.map(item => '<li>' + options.fn(item) + '</li>')
		return '<ul>\n' + itemsAsHtml.join('\n') + '\n</ul>'
	})

	Handlebars.registerHelper('bold', function (text) {
		const result = '<b>' + Handlebars.escapeExpression(text) + '</b>'
		return new Handlebars.SafeString(result)
	})

	Handlebars.registerHelper('space', function (height) {
		return new Handlebars.SafeString(`<tr><td height="${height}px"></td></tr>`)
	})

	Handlebars.registerHelper('ifEquals', function (a, b, opts) {
		if (a == b) {
			return opts.fn(self)
		} else {
			return opts.inverse(self)
		}
	})

	Handlebars.registerHelper('title', function (options) {
		const fontFamily = styles.font.family
		let color = styles.text.primary

		let size = '28px'
		let weight = '400'
		let lineHeight = '28px'
		let maxWidth = '100%'

		for (const key in options.hash) {
			if (options.hash.hasOwnProperty(key)) {
				const normalizedKey = key.replace('_', '-')

				if (normalizedKey === 'color') {
					color = options.hash[key]
				} else if (normalizedKey === 'font-size') {
					size = options.hash[key]
				} else if (normalizedKey === 'font-weight') {
					weight = options.hash[key]
				} else if (normalizedKey === 'line-height') {
					lineHeight = options.hash[key]
				} else if (normalizedKey === 'max-width') {
					maxWidth = options.hash[key]
				}
			}
		}

		// logger.verbose(`title helper: ${JSON.stringify(options)}`)

		const styleAttribute = `
			font-family: ${fontFamily}; 
			margin: 0; color: ${color}; 
			font-size: ${size}; 
			font-weight: ${weight}; 
			line-height: ${lineHeight}; 
			max-width: ${maxWidth};
		`

		return new Handlebars.SafeString(`<h1 style="${styleAttribute}" class="title">${options.fn(this)}</h1>`)
	})

	Handlebars.registerHelper('paragraph', function (options) {
		const fontFamily = styles.font.family
		let color = styles.text.surface

		let size = '16px'
		let weight = '400'
		let lineHeight = '23px'
		let maxWidth = '100%'

		for (const key in options.hash) {
			if (options.hash.hasOwnProperty(key)) {
				const normalizedKey = key.replace('_', '-')

				if (normalizedKey === 'color') {
					color = options.hash[key]
				} else if (normalizedKey === 'font-size') {
					size = options.hash[key]
				} else if (normalizedKey === 'font-weight') {
					weight = options.hash[key]
				} else if (normalizedKey === 'line-height') {
					lineHeight = options.hash[key]
				} else if (normalizedKey === 'max-width') {
					maxWidth = options.hash[key]
				}
			}
		}

		// logger.verbose(`paragraph helper: ${JSON.stringify(options)}`)

		const styleAttribute = `
            font-family: ${fontFamily}; 
            margin: 0; color: ${color}; 
            font-size: ${size}; 
            font-weight: ${weight}; 
            line-height: ${lineHeight}; 
            max-width: ${maxWidth};
        `

		return new Handlebars.SafeString(`<p style="${styleAttribute}" class="paragraph">${options.fn(this)}</p>`)
	})
}

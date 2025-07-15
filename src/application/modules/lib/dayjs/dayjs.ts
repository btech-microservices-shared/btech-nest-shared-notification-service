import { cosmiconfigSync } from 'cosmiconfig'
import * as dayjs from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

/**
 * opciones
 */

let options = {
	defaultLocale: 'en',
	locales: new Set(['en', 'es'])
}

const dayjsCosmiconfig = cosmiconfigSync('dayjs').search()

if (!!dayjsCosmiconfig) {
	const { config, isEmpty } = dayjsCosmiconfig

	if (!isEmpty && !!config) {
		if (Array.isArray(config.locales)) {
			config.locales.forEach(locale => options.locales.add(locale))
		}

		if (config.defaultLocale?.trim()?.length > 0) {
			options.defaultLocale = config.defaultLocale
		}
	}
}

/**
 * setup
 */

dayjs.extend(utc)
dayjs.extend(timezone)

for (const locale of options.locales.keys()) {
	try {
		require(`dayjs/locale/${locale}`)
	} catch (error) {
		console.log(error)
	}
}

dayjs.locale(options.defaultLocale)

options = null

export { dayjs, timezone, utc }

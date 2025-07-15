import { Injectable, Logger } from '@nestjs/common'
import { MessageStyles } from 'src/domain/entities/message-styles.entity'
import { ThemeService } from 'src/domain/services/theme.service'

@Injectable()
export class ThemeServiceImpl implements ThemeService {
	readonly #_messageStyles: MessageStyles
	readonly #_logger = new Logger(ThemeServiceImpl.name)

	constructor() {
		this.#_messageStyles = this.#_loadMessageStyles()
	}

	getThemeStyles(): MessageStyles {
		this.#_logger.log(`Fetching theme styles`)
		return this.#_messageStyles
	}

	#_loadMessageStyles(): MessageStyles {
		return new MessageStyles({
			background: {
				surface: '#FDFCFB',
				surfaceDark: '#2E2D2D'
			},
			text: {
				primary: '#163005',
				gradiant: '#DCFF88',
				surface: '#807F7E',
				onSurface: '#FDFCFB',
				onPrimary: '#FDFCFB'
			},
			font: {
				family: 'Cera Pro, Nunito Sans, Ubuntu, Montserrat, Open Sans, Trebuchet MS, sans-serif'
			},
			withoutLine: false,
			variants: {
				primary: {
					backgroundColor: '#163005',
					color: '#FDFCFB'
				},
				secondary: {
					backgroundColor: '#DCFF88',
					color: '#163005'
				},
				tertiary: {
					backgroundColor: '#d16a02',
					color: '#FFFFFF'
				},
				outlined: {
					backgroundColor: '#FFFFFF',
					color: '#807F7E'
				}
			}
		})
	}
}

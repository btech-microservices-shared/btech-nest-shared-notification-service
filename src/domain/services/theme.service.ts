import { MessageStyles } from '../entities/message-styles.entity'

export abstract class ThemeService {
	abstract getThemeStyles(): MessageStyles
}

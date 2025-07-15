export class MessageStyles {
	background: {
		surface: string
		surfaceDark: string
	}
	text: {
		primary: string
		gradiant: string
		surface: string
		onSurface: string
		onPrimary: string
	}
	font: {
		family: string
	}
	withoutLine: boolean
	variants: {
		primary: {
			backgroundColor: string
			color: string
		}
		secondary: {
			backgroundColor: string
			color: string
		}
		tertiary: {
			backgroundColor: string
			color: string
		}
		outlined: {
			backgroundColor: string
			color: string
		}
	}

	constructor({
		background,
		text,
		font,
		withoutLine,
		variants
	}: {
		background: {
			surface: string
			surfaceDark: string
		}
		text: {
			primary: string
			gradiant: string
			surface: string
			onSurface: string
			onPrimary: string
		}
		font: {
			family: string
		}
		withoutLine: boolean
		variants: {
			primary: {
				backgroundColor: string
				color: string
			}
			secondary: {
				backgroundColor: string
				color: string
			}
			tertiary: {
				backgroundColor: string
				color: string
			}
			outlined: {
				backgroundColor: string
				color: string
			}
		}
	}) {
		this.background = background
		this.text = text
		this.font = font
		this.withoutLine = withoutLine
		this.variants = variants
	}
}

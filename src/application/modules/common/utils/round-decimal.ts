export function roundDecimal(value: number, decimalPlaces: number): number {
	if (value === 0) {
		return value
	}

	let roundedValue = Number(Math.round(<any>(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)

	if (isNaN(roundedValue)) {
		roundedValue = 0
	}

	return roundedValue
}

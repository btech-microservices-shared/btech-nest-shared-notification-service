import { Transform } from 'class-transformer'
import { isSet } from 'src/libs/lib/utils'

export const TransformToBoolean = () => {
	return Transform(({ value }) => {
		if (isSet(value)) {
			return String(value).toUpperCase() === 'TRUE'
		}

		return null
	})
}

export const TransformToDate = (options?: { isFromQuery?: boolean }) => {
	return Transform(({ value }) => {
		let issuedValue = options?.isFromQuery === true ? Number(value) : value

		return isSet(issuedValue) ? new Date(issuedValue) : null
	})
}

export const TransformToString = () => {
	return Transform(({ value }) => {
		return isSet(value) ? String(value) : null
	})
}

export const TransformToNumber = () => {
	return Transform(({ value }) => {
		return isSet(value) ? Number(value) : null
	})
}

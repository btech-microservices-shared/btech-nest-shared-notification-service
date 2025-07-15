import { Transform } from 'class-transformer'
import { isSet } from 'src/libs/lib/utils'

export function TransformToEnumeration(enumeration: { of: (value: unknown) => any }) {
	return Transform(({ value }) => {
		if (isSet(value)) {
			return enumeration.of(value)
		}

		return null
	})
}

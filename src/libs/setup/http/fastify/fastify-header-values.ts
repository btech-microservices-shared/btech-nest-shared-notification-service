import { HeaderValues } from '../../core/header-values/header-values'

export class FastifyHeaderValues extends HeaderValues {
	constructor(entity: FastifyHeaderValues) {
		super()
		Object.assign(this, entity)
	}
}

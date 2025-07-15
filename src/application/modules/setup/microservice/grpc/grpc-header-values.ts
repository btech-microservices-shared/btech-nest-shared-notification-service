import { HeaderValues } from '../../core/header-values/header-values'

export class GrpcHeaderValues extends HeaderValues {
	constructor(entity: GrpcHeaderValues) {
		super()
		Object.assign(this, entity)
	}
}

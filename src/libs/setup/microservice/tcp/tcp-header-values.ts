import { HeaderValues } from '../../core/header-values/header-values'

export class TcpHeaderValues extends HeaderValues {
	constructor(entity: TcpHeaderValues) {
		super()
		Object.assign(this, entity)
	}
}

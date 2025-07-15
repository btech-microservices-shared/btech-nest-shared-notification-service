import { ApiHeader } from '@nestjs/swagger'

export const ApiAppTypeIdHeader = (required = false) => {
	return ApiHeader({ name: 'x-app-type-id', description: 'Id del tipo de aplicación', required: required ?? false })
}

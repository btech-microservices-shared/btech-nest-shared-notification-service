import { ApiHeader } from '@nestjs/swagger'

export const ApiAppIdHeader = (required = false) => {
	return ApiHeader({ name: 'x-app-id', description: 'Id de la aplicación', required: required ?? false })
}

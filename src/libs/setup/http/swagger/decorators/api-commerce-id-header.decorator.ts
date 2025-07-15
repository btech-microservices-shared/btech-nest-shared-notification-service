import { ApiHeader } from '@nestjs/swagger'

export const ApiCommerceIdHeader = (required = false) => {
	return ApiHeader({ name: 'x-commerce-id', description: 'Id del comercio', required: required ?? false })
}

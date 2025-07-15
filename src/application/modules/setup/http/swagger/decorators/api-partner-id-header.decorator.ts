import { ApiHeader } from '@nestjs/swagger'

export const ApiPartnerIdHeader = (required = false) => {
	return ApiHeader({ name: 'x-partner-id', description: 'Id del partner', required: required ?? false })
}

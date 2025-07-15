import { ApiHeader } from '@nestjs/swagger'

export const ApiChannelIdHeader = (required = false) => {
	return ApiHeader({ name: 'x-channel-id', description: 'Id del canal', required: required ?? false })
}

import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiOperation } from '@nestjs/swagger'

export function AppOperation(method: MethodDecorator, summary: string, description?: string, deprecated?: boolean) {
	return applyDecorators(
		method,
		ApiOperation({ summary, description, deprecated }),
		ApiBadRequestResponse({ description: 'Parámetros inválidos' }),
		ApiConflictResponse({ description: 'No se cumplio alguna regla de negocio o validación' }),
		ApiInternalServerErrorResponse({ description: 'Error en la solicitud' })
	)
}

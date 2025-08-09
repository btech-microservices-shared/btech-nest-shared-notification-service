/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus } from '@nestjs/common';
import { EmailErrorResponse } from '../interfaces/email-error-response.interface';
import { handleGenericEmailError } from './handle-generic-email-error.helper';

export const handleMailtrapError = (error: any): EmailErrorResponse => {
  const status = error?.response?.status || error?.status;
  const data = error?.response?.data || error?.data;

  if (!status) {
    return handleGenericEmailError(error);
  }

  switch (status) {
    case 401:
      return {
        message: 'Token de acceso de Mailtrap inválido o expirado',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    case 403:
      return {
        message: 'Sin permisos para enviar emails con Mailtrap',
        statusCode: HttpStatus.FORBIDDEN,
      };
    case 422:
      return {
        message: data?.message
          ? `Error de validación Mailtrap: ${data.message}`
          : 'Datos de email inválidos para Mailtrap',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      };
    case 429:
      return {
        message: 'Límite de emails alcanzado en Mailtrap',
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
      };
    default:
      return {
        message: `Error Mailtrap (${status}): ${data?.message || 'Error desconocido'}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
  }
};

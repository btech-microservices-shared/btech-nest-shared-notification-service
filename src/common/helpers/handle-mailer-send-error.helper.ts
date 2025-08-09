/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus } from '@nestjs/common';
import { handleGenericEmailError } from './handle-generic-email-error.helper';
import { EmailErrorResponse } from '../interfaces/email-error-response.interface';

export const handleMailerSendError = (error: any): EmailErrorResponse => {
  // Múltiples formas de acceder al status code de MailerSend
  const status =
    error?.error?.statusCode ||
    error?.statusCode ||
    error?.response?.status ||
    error?.code;

  const body =
    error?.error?.body || error?.body || error?.response?.data || error?.data;

  if (!status) {
    return handleGenericEmailError(error);
  }

  switch (status) {
    case 401:
      return {
        message: 'Token de acceso de MailerSend inválido o expirado',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    case 403:
      return {
        message: 'Sin permisos para enviar emails con MailerSend',
        statusCode: HttpStatus.FORBIDDEN,
      };
    case 422:
      return {
        message: body?.message
          ? `Error de validación MailerSend: ${body.message}`
          : 'Datos de email inválidos para MailerSend',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      };
    case 429:
      return {
        message: 'Límite de emails alcanzado en MailerSend (rate limit)',
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
      };
    case 500:
      return {
        message: 'Error interno del servidor MailerSend',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    default:
      return {
        message: `Error MailerSend (${status}): ${body?.message || 'Error desconocido'}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
  }
};

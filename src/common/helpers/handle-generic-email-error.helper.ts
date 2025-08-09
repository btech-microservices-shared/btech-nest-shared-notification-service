import { HttpStatus } from '@nestjs/common';
import { EmailErrorResponse } from '../interfaces/email-error-response.interface';

export const handleGenericEmailError = (error: any): EmailErrorResponse => {
  if (!(error instanceof Error)) {
    return {
      message: `Error inesperado: ${String(error)}`,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  const message = error.message;

  // Errores de conexión
  if (message.includes('ENOTFOUND') || message.includes('getaddrinfo')) {
    return {
      message:
        'No se pudo conectar al servidor de email. Verifica tu conexión a internet.',
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    };
  }

  // Errores de timeout
  if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return {
      message:
        'Timeout al conectar con el proveedor de email. Intenta nuevamente.',
      statusCode: HttpStatus.REQUEST_TIMEOUT,
    };
  }

  // Errores de SSL/TLS
  if (
    message.includes('certificate') ||
    message.includes('SSL') ||
    message.includes('TLS')
  ) {
    return {
      message:
        'Error de certificado SSL/TLS al conectar con el proveedor de email.',
      statusCode: HttpStatus.BAD_GATEWAY,
    };
  }

  // Errores de API key
  if (message.includes('API key') || message.includes('api_key')) {
    return {
      message: 'API key del proveedor de email no válida o no configurada',
      statusCode: HttpStatus.UNAUTHORIZED,
    };
  }

  // Error de parsing/formato
  if (message.includes('JSON') || message.includes('parse')) {
    return {
      message: 'Error de formato en la respuesta del proveedor de email',
      statusCode: HttpStatus.BAD_GATEWAY,
    };
  }

  return {
    message: `Error del proveedor de email: ${message}`,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  };
};

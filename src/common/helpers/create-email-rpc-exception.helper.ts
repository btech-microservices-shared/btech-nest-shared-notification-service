import { RpcException } from '@nestjs/microservices';
import { EmailErrorResponse } from '../interfaces/email-error-response.interface';

export const createEmailRpcException = (
  errorResult: EmailErrorResponse,
  serviceName: string,
): RpcException => {
  return new RpcException({
    status: errorResult.statusCode,
    message: errorResult.message,
    service: serviceName,
  });
};

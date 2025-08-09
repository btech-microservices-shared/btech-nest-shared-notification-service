import { RpcException } from '@nestjs/microservices';
import { EmailErrorResponse } from '../interfaces/email-error-response.interface';
import { status as GrpcStatus } from '@grpc/grpc-js';

export const createEmailRpcException = (
  errorResult: EmailErrorResponse,
  serviceName: string,
): RpcException => {
  return new RpcException({
    code: GrpcStatus.INTERNAL,
    message: JSON.stringify({
      status: errorResult.statusCode,
      message: errorResult.message,
      service: serviceName,
    }),
  });
};

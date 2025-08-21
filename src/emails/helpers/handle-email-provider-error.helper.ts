import { RpcException } from '@nestjs/microservices';
import { createEmailRpcException } from 'src/common/helpers/create-email-rpc-exception.helper';
import { handleGenericEmailError } from 'src/common/helpers/handle-generic-email-error.helper';
import { handleMailerSendError } from 'src/common/helpers/handle-mailer-send-error.helper';
import { handleMailtrapError } from 'src/common/helpers/handle-mailtrap-error.helper';
import { EmailErrorResponse } from 'src/common/interfaces/email-error-response.interface';

export const handleEmailProviderError = (
  error: any,
  providerType: 'mailersend' | 'mailtrap' | 'generic' | 'office365',
  serviceName: string,
): RpcException => {
  let errorResult: EmailErrorResponse;

  switch (providerType) {
    case 'mailersend':
      errorResult = handleMailerSendError(error);
      break;
    case 'mailtrap':
      errorResult = handleMailtrapError(error);
      break;
    default:
      errorResult = handleGenericEmailError(error);
  }

  return createEmailRpcException(errorResult, serviceName);
};

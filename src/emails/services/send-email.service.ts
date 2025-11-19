/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RpcException } from '@nestjs/microservices';
import { SendEmailDto, SendEmailResponseDto } from '../dto/send-email.dto';
import { EmailProviderFactory } from '../factories/email-provider.factory';
import { DynamicSmtpProvider } from '../providers/dynamic-smtp.provider';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);
  constructor(private readonly emailProviderFactory: EmailProviderFactory) {}
  async execute(
    sendEmailDto: SendEmailDto,
    subscriptionDetailId: string,
  ): Promise<SendEmailResponseDto> {
    try {
      // Obtener el proveedor adecuado según el tenant
      const { provider, config } =
        await this.emailProviderFactory.getProviderForTenant(
          subscriptionDetailId,
        );
      let result;
      // Si es DynamicSmtpProvider, necesita la config del tenant
      if (provider instanceof DynamicSmtpProvider) {
        if (!config)
          throw new RpcException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message:
              'Configuración de servidor SMTP no encontrada para el tenant',
          });
        this.logger.log(
          `Enviando email usando servidor SMTP del tenant: ${config.subscriptionDetailId}`,
        );
        result = await provider.sendEmail(sendEmailDto, config);
      } else {
        // Proveedor por defecto (Office365) - tenant sin configuración
        this.logger.log(
          `Enviando email usando proveedor por defecto para tenant: ${subscriptionDetailId}`,
        );
        result = await provider.sendEmail(sendEmailDto);
      }
      if (!result.success) {
        const errorMessage = result.error || 'Error en el proveedor de email';
        throw new RpcException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessage,
        });
      }
      return {
        success: true,
        message: result.message,
        messageId: result.messageId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al enviar correo';
      this.logger.error(errorMessage);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      });
    }
  }
}

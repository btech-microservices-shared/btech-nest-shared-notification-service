import { HttpStatus, Injectable } from '@nestjs/common';
import { SendEmailDto, SendEmailResponseDto } from './dto/send-email.dto';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { buildLabReservationEmail } from './templates/build-lab-reservation-email.template';
import { envs } from 'src/config/email.config';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcSatus } from '@grpc/grpc-js';

@Injectable()
export class EmailsService {
  constructor(private readonly emailProviderFactory: EmailProviderFactory) {}

  async sendEmail(
    sendEmailDto: SendEmailDto,
    providerName = envs.email.providers.default,
  ): Promise<SendEmailResponseDto> {
    try {
      const provider = this.emailProviderFactory.getProvider(
        providerName || envs.email.providers.default,
      );
      const result = await provider.sendEmail(sendEmailDto);
      if (!result.success)
        throw new RpcException({
          code: GrpcSatus.INTERNAL,
          details: {
            stauts: HttpStatus.INTERNAL_SERVER_ERROR,
            message: result.error || 'Error en el proveedor de email',
            service: 'emails-service',
          },
        });
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al enviar correo';
      console.log(errorMessage);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: GrpcSatus.INTERNAL,
        details: {
          stauts: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessage,
          service: 'emails-service',
        },
      });
    }
  }

  sendLabReservationEmail(
    sendLabReservationEmailDto: SendLabReservationEmailDto,
  ): Promise<SendEmailResponseDto> {
    const html = buildLabReservationEmail(sendLabReservationEmailDto);

    const emailData: SendEmailDto = {
      from: 'emailempresa@gmail.com',
      to: sendLabReservationEmailDto.to,
      subject: 'Confirmación de Reserva',
      html,
    };
    return this.sendEmail(emailData);
  }
}

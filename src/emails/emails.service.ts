/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SendEmailDto, SendEmailResponseDto } from './dto/send-email.dto';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { buildLabReservationEmail } from './templates/build-lab-reservation-email.template';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { RpcException } from '@nestjs/microservices';
import { envs } from 'src/config/env.config';
import { DynamicSmtpProvider } from './providers/dynamic-smtp.provider';
import { SendSupportTicketsEmailDto } from './dto/send-support-tickets-email.dto';
import { buildSupportTicketsEmail } from './templates/build-support-tickets-email.template';
import { SendLabEquipmentReservationCancellationEmailDto } from './dto/send-lab-equipment-reservation-cancellation-email.dto';
import { buildLabEquipmentReservationCancellationEmail } from './templates/build-lab-equipment-reservation-cancellation-email.template';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(private readonly emailProviderFactory: EmailProviderFactory) {}

  async sendEmail(
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

  async sendLabReservationEmail(
    sendLabReservationEmailDto: SendLabReservationEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Obtener la configuración del tenant para verificar si tiene logo personalizado
    const { config } = await this.emailProviderFactory.getProviderForTenant(
      sendLabReservationEmailDto.subscriptionDetailId,
    );
    const logoUrl = config?.logoUrl || sendLabReservationEmailDto.logoUrl;
    const html = buildLabReservationEmail({
      ...sendLabReservationEmailDto,
      logoUrl,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: sendLabReservationEmailDto.to,
      subject: 'Confirmación de Reserva',
      html,
    };
    return this.sendEmail(
      emailData,
      sendLabReservationEmailDto.subscriptionDetailId,
    );
  }

  sendSupportTicketsEmail(
    sendSupportTicketsEmailDto: SendSupportTicketsEmailDto,
  ): Promise<SendEmailResponseDto> {
    const html = buildSupportTicketsEmail(sendSupportTicketsEmailDto);
    const subject = `[Nuevo Ticket] #${sendSupportTicketsEmailDto.ticketNumber} - ${sendSupportTicketsEmailDto.title}`;

    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: sendSupportTicketsEmailDto.to,
      subject,
      html,
    };
    return this.sendEmail(
      emailData,
      sendSupportTicketsEmailDto.subscriptionDetailId,
    );
  }

  async sendLabEquipmentReservationCancellationEmail(
    dto: SendLabEquipmentReservationCancellationEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Obtener la configuración del tenant para verificar si tiene logo personalizado
    const { config } = await this.emailProviderFactory.getProviderForTenant(
      dto.subscriptionDetailId,
    );
    const logoUrl =
      dto.metadata.emailNotificationData.logoUrl || config?.logoUrl;
    if (!logoUrl)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No se encontró un logo válido para enviar el correo',
      });
    const html = buildLabEquipmentReservationCancellationEmail({
      logoUrl,
      companyName: dto.metadata.emailNotificationData.companyName,
      subscriberName: dto.metadata.emailNotificationData.subscriberName,
      laboratoryName: dto.metadata.emailNotificationData.laboratoryName,
      reservationDate: dto.metadata.emailNotificationData.reservationDate,
      initialHour: dto.metadata.emailNotificationData.initialHour,
      finalHour: dto.metadata.emailNotificationData.finalHour,
      primaryColor: dto.metadata.emailNotificationData.primaryColor,
      username: dto.metadata.username,
      password: dto.metadata.password,
      accessUrl: dto.metadata.accessUrl,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.metadata.emailNotificationData.subscriberEmail,
      subject: 'Cancelación de Reserva de Equipo de Laboratorio',
      html,
    };
    return this.sendEmail(emailData, dto.subscriptionDetailId);
  }
}

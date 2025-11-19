import { HttpStatus, Injectable } from '@nestjs/common';
import { SendLabReservationEmailDto } from '../dto/send-lab-reservation-email.dto';
import { SendEmailDto, SendEmailResponseDto } from '../dto/send-email.dto';
import { buildLabReservationEmail } from '../templates/vdi/build-lab-reservation-email.template';
import { SendEmailService } from './send-email.service';
import { SentEmailService } from './sent-email.service';
import { EmailProviderFactory } from '../factories/email-provider.factory';
import { envs } from 'src/config';
import { SendLabEquipmentReservationCancellationEmailDto } from '../dto/send-lab-equipment-reservation-cancellation-email.dto';
import { RpcException } from '@nestjs/microservices';
import { buildLabEquipmentReservationCancellationEmail } from '../templates/vdi/build-lab-equipment-reservation-cancellation-email.template';
import { SendLabReservationReminderEmailDto } from '../dto/send-lab-reservation-reminder-email.dto';
import { buildLabReservationReminderEmail } from '../templates/vdi/build-lab-reservation-reminder-email.template';

@Injectable()
export class EmailVdiService {
  constructor(
    private readonly emailProviderFactory: EmailProviderFactory,
    private readonly sendEmailService: SendEmailService,
    private readonly sentEmailService: SentEmailService,
  ) {}
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
      appDomain: envs.app.domain,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: sendLabReservationEmailDto.to,
      subject: 'Notificación de Reserva',
      html,
    };
    const result = await this.sendEmailService.execute(
      emailData,
      sendLabReservationEmailDto.subscriptionDetailId,
    );

    if (result.success && result.messageId) {
      // Asumimos que el DTO tiene un 'reservationId'
      await this.sentEmailService.create(
        result.messageId,
        sendLabReservationEmailDto.reservationId, // Necesita ser añadido al DTO
        'RESERVATION',
      );
    }

    return result;
  }

  async sendLabEquipmentReservationCancellationEmail(
    dto: SendLabEquipmentReservationCancellationEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Asumimos que el DTO tiene un 'reservationId'
    const headers = await this.sentEmailService.getHeadersForReply(
      dto.reservationId, // Necesita ser añadido al DTO
      'RESERVATION',
    );
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
      subject: 'Notificación de Reserva',
      html,
      headers, // Añadimos las cabeceras aquí
    };
    const result = await this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId,
    );
    if (result.success && result.messageId) {
      await this.sentEmailService.create(
        result.messageId,
        dto.reservationId,
        'RESERVATION',
      );
    }
    return result;
  }

  async sendLabReservationReminderEmail(
    dto: SendLabReservationReminderEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Asumimos que el DTO tiene un 'reservationId'
    const headers = await this.sentEmailService.getHeadersForReply(
      dto.reservationId, // Necesita ser añadido al DTO
      'RESERVATION',
    );
    const { config } = await this.emailProviderFactory.getProviderForTenant(
      dto.subscriptionDetailId,
    );
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildLabReservationReminderEmail({
      companyName: dto.companyName,
      logoUrl,
      userName: dto.userName,
      reminderMinutes: dto.reminderMinutes,
      reservationDate: dto.reservationDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      labDescription: dto.labDescription,
      equipmentDescription: dto.equipmentDescription,
      primaryColor: dto.primaryColor,
      reservationLaboratoryEquipmentId: dto.reservationLaboratoryEquipmentId,
      appDomain: envs.app.domain,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.to,
      subject: `Notificación de Reserva`,
      html,
      headers, // Añadimos las cabeceras aquí
    };
    const result = await this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId,
    );
    if (result.success && result.messageId) {
      await this.sentEmailService.create(
        result.messageId,
        dto.reservationId,
        'RESERVATION',
      );
    }
    return result;
  }
}

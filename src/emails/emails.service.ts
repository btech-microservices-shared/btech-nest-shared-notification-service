/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { envs } from 'src/config/env.config';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { DynamicSmtpProvider } from './providers/dynamic-smtp.provider';
import { SentEmail } from './entities/sent-email.entity';
import { buildLabReservationEmail } from './templates/build-lab-reservation-email.template';
import { buildCreatedTicketEmail } from './templates/build-created-ticket-email.template';
import { buildLabEquipmentReservationCancellationEmail } from './templates/build-lab-equipment-reservation-cancellation-email.template';
import { buildPasswordRecoveryEmail } from './templates/build-password-recovery-email.template';
import { buildLabReservationReminderEmail } from './templates/build-lab-reservation-reminder-email.template';
import { buildPasswordRecoveryConfirmationEmail } from './templates/build-password-recovery-confirmation.template';
import { buildInitialPasswordConfirmationEmail } from './templates/build-initial-password-confirmation.template';
import { buildPasswordChangeConfirmationEmail } from './templates/build-password-change-confirmation.template';
import { buildUserRegistrationEmail } from './templates/build-user-registration-email.template';
import { SendEmailDto, SendEmailResponseDto } from './dto/send-email.dto';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { SendCreatedTicketEmailDto } from './dto/send-created-ticket-email.dto';
import { SendLabEquipmentReservationCancellationEmailDto } from './dto/send-lab-equipment-reservation-cancellation-email.dto';
import { SendPasswordRecoveryEmailDto } from './dto/send-password-recovery-email.dto';
import { SendLabReservationReminderEmailDto } from './dto/send-lab-reservation-reminder-email.dto';
import { SendPasswordRecoveryConfirmationDto } from './dto/send-password-recovery-confirmation.dto';
import { SendInitialPasswordConfirmationDto } from './dto/send-initial-password-confirmation.dto';
import { SendPasswordChangeConfirmationDto } from './dto/send-password-change-confirmation.dto';
import { SendUserRegistrationEmailDto } from './dto/send-user-registration-email.dto';
import { EmailHeaders } from './interfaces/email-provider.interface';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    private readonly emailProviderFactory: EmailProviderFactory,
    @InjectRepository(SentEmail)
    private readonly sentEmailRepository: Repository<SentEmail>,
  ) {}

  private async saveSentEmail(
    messageId: string,
    referenceId: string,
    referenceType: string,
  ): Promise<void> {
    try {
      const sentEmail = this.sentEmailRepository.create({
        messageId,
        referenceId,
        referenceType,
      });
      await this.sentEmailRepository.save(sentEmail);
      this.logger.log(
        `Email messageId ${messageId} saved for ${referenceType} ${referenceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to save email messageId for ${referenceType} ${referenceId}`,
        error.stack,
      );
    }
  }

  private async getHeadersForReply(
    referenceId: string,
    referenceType: string,
  ): Promise<EmailHeaders | undefined> {
    try {
      const sentEmail = await this.sentEmailRepository.findOne({
        where: { referenceId, referenceType },
        order: { createdAt: 'ASC' },
      });

      if (sentEmail) {
        this.logger.log(
          `Found original email for ${referenceType} ${referenceId}. Message-ID: ${sentEmail.messageId}`,
        );
        return {
          'In-Reply-To': sentEmail.messageId,
          References: sentEmail.messageId,
        };
      }
      this.logger.warn(
        `No original email found for ${referenceType} ${referenceId}. Sending as new email.`,
      );
    } catch (error) {
      this.logger.error(
        `Error fetching headers for ${referenceType} ${referenceId}`,
        error.stack,
      );
    }
    return undefined;
  }

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
      subject: 'Confirmación de Reserva',
      html,
    };
    const result = await this.sendEmail(
      emailData,
      sendLabReservationEmailDto.subscriptionDetailId,
    );

    if (result.success && result.messageId) {
      // Asumimos que el DTO tiene un 'reservationId'
      await this.saveSentEmail(
        result.messageId,
        sendLabReservationEmailDto.reservationId, // Necesita ser añadido al DTO
        'RESERVATION',
      );
    }

    return result;
  }

  async sendCreatedTicketEmail(
    sendCreatedTicketEmailDto: SendCreatedTicketEmailDto,
  ): Promise<SendEmailResponseDto> {
    const html = buildCreatedTicketEmail(sendCreatedTicketEmailDto);
    const subject = `[Nuevo Ticket] #${sendCreatedTicketEmailDto.ticketNumber} - ${sendCreatedTicketEmailDto.title}`;

    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: sendCreatedTicketEmailDto.to,
      subject,
      html,
    };

    const result = await this.sendEmail(
      emailData,
      sendCreatedTicketEmailDto.subscriptionDetailId,
    );

    if (result.success && result.messageId) {
      await this.saveSentEmail(
        result.messageId,
        sendCreatedTicketEmailDto.ticketNumber,
        'TICKET',
      );
    }

    return result;
  }

  async sendLabEquipmentReservationCancellationEmail(
    dto: SendLabEquipmentReservationCancellationEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Asumimos que el DTO tiene un 'reservationId'
    const headers = await this.getHeadersForReply(
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
      subject: 'Cancelación de Reserva de Equipo de Laboratorio',
      html,
      headers, // Añadimos las cabeceras aquí
    };
    const result = await this.sendEmail(emailData, dto.subscriptionDetailId);
    if (result.success && result.messageId) {
      await this.saveSentEmail(
        result.messageId,
        dto.reservationId,
        'RESERVATION',
      );
    }
    return result;
  }

  async sendPasswordRecoveryEmail(
    dto: SendPasswordRecoveryEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Obtener la configuración del tenant para verificar si tiene logo personalizado
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildPasswordRecoveryEmail({
      fullName: dto.fullName,
      username: dto.username,
      pin: dto.pin,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Recuperación de Contraseña',
      html,
    };
    // Si no tiene subscriptionDetailId, usar el proveedor por defecto
    return this.sendEmail(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendLabReservationReminderEmail(
    dto: SendLabReservationReminderEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Asumimos que el DTO tiene un 'reservationId'
    const headers = await this.getHeadersForReply(
      (dto as any).reservationId, // Necesita ser añadido al DTO
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
      subject: `Recordatorio: Tu reserva comienza pronto`,
      html,
      headers, // Añadimos las cabeceras aquí
    };
    const result = await this.sendEmail(emailData, dto.subscriptionDetailId);
    if (result.success && result.messageId) {
      await this.saveSentEmail(
        result.messageId,
        dto.reservationId,
        'RESERVATION',
      );
    }
    return result;
  }

  async sendPasswordRecoveryConfirmation(
    dto: SendPasswordRecoveryConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildPasswordRecoveryConfirmationEmail({
      fullName: dto.fullName,
      username: dto.username,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Contraseña Recuperada Exitosamente',
      html,
    };
    return this.sendEmail(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendInitialPasswordConfirmation(
    dto: SendInitialPasswordConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildInitialPasswordConfirmationEmail({
      fullName: dto.fullName,
      username: dto.username,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Contraseña Inicial Configurada',
      html,
    };
    return this.sendEmail(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendPasswordChangeConfirmation(
    dto: SendPasswordChangeConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildPasswordChangeConfirmationEmail({
      fullName: dto.fullName,
      username: dto.username,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Contraseña Actualizada Exitosamente',
      html,
    };
    return this.sendEmail(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendUserRegistrationEmail(
    dto: SendUserRegistrationEmailDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildUserRegistrationEmail({
      fullName: dto.fullName,
      username: dto.username,
      password: dto.password,
      role: dto.role,
      codeService: dto.codeService,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Bienvenido - Tu Cuenta Ha Sido Creada',
      html,
    };
    return this.sendEmail(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }
}

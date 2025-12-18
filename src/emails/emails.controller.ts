import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { SendCreatedTicketEmailDto } from './dto/send-created-ticket-email.dto';
import { SendTicketCommentEmailDto } from './dto/send-ticket-comment-email.dto';
import { SendEmailResponseDto } from './dto/send-email.dto';
import { SendLabEquipmentReservationCancellationEmailDto } from './dto/send-lab-equipment-reservation-cancellation-email.dto';
import { SendPasswordRecoveryEmailDto } from './dto/send-password-recovery-email.dto';
import { SendLabReservationReminderEmailDto } from './dto/send-lab-reservation-reminder-email.dto';
import { SendPasswordRecoveryConfirmationDto } from './dto/send-password-recovery-confirmation.dto';
import { SendInitialPasswordConfirmationDto } from './dto/send-initial-password-confirmation.dto';
import { SendPasswordChangeConfirmationDto } from './dto/send-password-change-confirmation.dto';
import { SendUserRegistrationEmailDto } from './dto/send-user-registration-email.dto';
import { SendUserUpdateEmailDto } from './dto/send-user-update-email.dto';
import { EmailVdiService } from './services/email-vdi.service';
import { EmailAccessService, EmailSupportService } from './services';

@Controller('email')
export class EmailsController {
  constructor(
    private readonly emailVdiService: EmailVdiService,
    private readonly emailAccessService: EmailAccessService,
    private readonly emailSupportService: EmailSupportService,
  ) {}

  @GrpcMethod('EmailsService', 'SendLabReservationEmail')
  async sendLabReservationEmail(
    data: SendLabReservationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailVdiService.sendLabReservationEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendCreatedTicketEmail')
  async sendCreatedTicketEmail(
    data: SendCreatedTicketEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailSupportService.sendCreatedTicketEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendTicketCommentEmail')
  async sendTicketCommentEmail(
    data: SendTicketCommentEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailSupportService.sendTicketCommentEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendLabEquipmentReservationCancellationEmail')
  async sendLabEquipmentReservationCancellationEmail(
    data: SendLabEquipmentReservationCancellationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailVdiService.sendLabEquipmentReservationCancellationEmail(
      data,
    );
  }

  @GrpcMethod('EmailsService', 'SendPasswordRecoveryEmail')
  async sendPasswordRecoveryEmail(
    data: SendPasswordRecoveryEmailDto,
  ): Promise<SendEmailResponseDto> {
    console.log('SendPasswordRecoveryEmail');
    return this.emailAccessService.sendPasswordRecoveryEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendLabReservationReminderEmail')
  async sendLabReservationReminderEmail(
    data: SendLabReservationReminderEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailVdiService.sendLabReservationReminderEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendPasswordRecoveryConfirmation')
  async sendPasswordRecoveryConfirmation(
    data: SendPasswordRecoveryConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailAccessService.sendPasswordRecoveryConfirmation(data);
  }

  @GrpcMethod('EmailsService', 'SendInitialPasswordConfirmation')
  async sendInitialPasswordConfirmation(
    data: SendInitialPasswordConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailAccessService.sendInitialPasswordConfirmation(data);
  }

  @GrpcMethod('EmailsService', 'SendPasswordChangeConfirmation')
  async sendPasswordChangeConfirmation(
    data: SendPasswordChangeConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailAccessService.sendPasswordChangeConfirmation(data);
  }

  @GrpcMethod('EmailsService', 'SendUserRegistrationEmail')
  async sendUserRegistrationEmail(
    data: SendUserRegistrationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailAccessService.sendUserRegistrationEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendUserUpdateEmail')
  async sendUserUpdateEmail(
    data: SendUserUpdateEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailAccessService.sendUserUpdateEmail(data);
  }
}

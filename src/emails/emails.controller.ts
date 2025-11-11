import { Controller } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { SendSupportTicketsEmailDto } from './dto/send-support-tickets-email.dto';
import { SendEmailResponseDto } from './dto/send-email.dto';
import { SendLabEquipmentReservationCancellationEmailDto } from './dto/send-lab-equipment-reservation-cancellation-email.dto';
import { SendPasswordRecoveryEmailDto } from './dto/send-password-recovery-email.dto';
import { SendLabReservationReminderEmailDto } from './dto/send-lab-reservation-reminder-email.dto';
import { SendPasswordRecoveryConfirmationDto } from './dto/send-password-recovery-confirmation.dto';
import { SendInitialPasswordConfirmationDto } from './dto/send-initial-password-confirmation.dto';
import { SendPasswordChangeConfirmationDto } from './dto/send-password-change-confirmation.dto';
import { SendUserRegistrationEmailDto } from './dto/send-user-registration-email.dto';

@Controller('email')
export class EmailsController {
  constructor(private readonly emailService: EmailsService) {}

  @GrpcMethod('EmailsService', 'SendLabReservationEmail')
  async sendLabReservationEmail(
    data: SendLabReservationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendLabReservationEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendSupportTicketsEmail')
  async sendSupportTicketsEmail(
    data: SendSupportTicketsEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendSupportTicketsEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendLabEquipmentReservationCancellationEmail')
  async sendLabEquipmentReservationCancellationEmail(
    data: SendLabEquipmentReservationCancellationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendLabEquipmentReservationCancellationEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendPasswordRecoveryEmail')
  async sendPasswordRecoveryEmail(
    data: SendPasswordRecoveryEmailDto,
  ): Promise<SendEmailResponseDto> {
    console.log('SendPasswordRecoveryEmail');
    return this.emailService.sendPasswordRecoveryEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendLabReservationReminderEmail')
  async sendLabReservationReminderEmail(
    data: SendLabReservationReminderEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendLabReservationReminderEmail(data);
  }

  @GrpcMethod('EmailsService', 'SendPasswordRecoveryConfirmation')
  async sendPasswordRecoveryConfirmation(
    data: SendPasswordRecoveryConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendPasswordRecoveryConfirmation(data);
  }

  @GrpcMethod('EmailsService', 'SendInitialPasswordConfirmation')
  async sendInitialPasswordConfirmation(
    data: SendInitialPasswordConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendInitialPasswordConfirmation(data);
  }

  @GrpcMethod('EmailsService', 'SendPasswordChangeConfirmation')
  async sendPasswordChangeConfirmation(
    data: SendPasswordChangeConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendPasswordChangeConfirmation(data);
  }

  @GrpcMethod('EmailsService', 'SendUserRegistrationEmail')
  async sendUserRegistrationEmail(
    data: SendUserRegistrationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendUserRegistrationEmail(data);
  }
}

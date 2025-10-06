import { Controller } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { SendSupportTicketsEmailDto } from './dto/send-support-tickets-email.dto';
import { SendEmailResponseDto } from './dto/send-email.dto';
import { SendLabEquipmentReservationCancellationEmailDto } from './dto/send-lab-equipment-reservation-cancellation-email.dto';
import { SendPasswordRecoveryEmailDto } from './dto/send-password-recovery-email.dto';

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
    return this.emailService.sendPasswordRecoveryEmail(data);
  }
}

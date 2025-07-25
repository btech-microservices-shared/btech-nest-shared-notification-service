import { Controller } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SendLabReservationEmailDto } from './dto/send-lab-reservation-email.dto';
import { SendEmailResponseDto } from './dto/send-email.dto';

@Controller('email')
export class EmailsController {
  constructor(private readonly emailService: EmailsService) {}

  @GrpcMethod('EmailsService', 'SendLabReservationEmail')
  async sendLabReservationEmail(
    data: SendLabReservationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return this.emailService.sendLabReservationEmail(data);
  }
}

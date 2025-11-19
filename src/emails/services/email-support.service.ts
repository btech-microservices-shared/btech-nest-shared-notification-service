import { envs } from 'src/config';
import { SendCreatedTicketEmailDto } from '../dto/send-created-ticket-email.dto';
import { SendEmailDto, SendEmailResponseDto } from '../dto/send-email.dto';
import { buildCreatedTicketEmail } from '../templates/support/build-created-ticket-email.template';
import { SendEmailService } from './send-email.service';
import { SentEmailService } from './sent-email.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSupportService {
  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly sentEmailService: SentEmailService,
  ) {}
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

    const result = await this.sendEmailService.execute(
      emailData,
      sendCreatedTicketEmailDto.subscriptionDetailId,
    );

    if (result.success && result.messageId) {
      await this.sentEmailService.create(
        result.messageId,
        sendCreatedTicketEmailDto.ticketNumber,
        'TICKET',
      );
    }

    return result;
  }
}

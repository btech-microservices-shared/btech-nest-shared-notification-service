import { envs } from 'src/config';
import { SendCreatedTicketEmailDto } from '../dto/send-created-ticket-email.dto';
import { SendTicketCommentEmailDto } from '../dto/send-ticket-comment-email.dto';
import { SendEmailDto, SendEmailResponseDto } from '../dto/send-email.dto';
import { buildCreatedTicketEmail } from '../templates/support/build-created-ticket-email.template';
import { buildTicketCommentEmail } from '../templates/support/build-ticket-comment-email.template';
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
    const subject = `[NUEVO TICKET] ${sendCreatedTicketEmailDto.ticketNumber}`;

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

  async sendTicketCommentEmail(
    sendTicketCommentEmailDto: SendTicketCommentEmailDto,
  ): Promise<SendEmailResponseDto> {
    const html = buildTicketCommentEmail(sendTicketCommentEmailDto);
    const subject = `Re: [NUEVO TICKET] ${sendTicketCommentEmailDto.ticketNumber}`;

    const headers = await this.sentEmailService.getHeadersForReply(
      sendTicketCommentEmailDto.ticketNumber,
      'TICKET',
    );

    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: sendTicketCommentEmailDto.to,
      subject,
      html,
      headers,
    };

    const result = await this.sendEmailService.execute(
      emailData,
      sendTicketCommentEmailDto.subscriptionDetailId,
    );

    if (result.success && result.messageId) {
      await this.sentEmailService.create(
        result.messageId,
        sendTicketCommentEmailDto.ticketNumber,
        'TICKET',
      );
    }

    return result;
  }
}

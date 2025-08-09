import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { envs } from 'src/config/email.config';
import {
  EmailData,
  EmailProvider,
  EmailResult,
} from '../interfaces/email-provider.interface';
import { RpcException } from '@nestjs/microservices';
import { SERVICE_NAME } from 'src/config/constants';
import { handleEmailProviderError } from '../helpers/handle-email-provider-error.helper';

@Injectable()
export class MailerSendProvider implements EmailProvider {
  private mailerSend: MailerSend;

  constructor() {
    this.mailerSend = new MailerSend({
      apiKey: envs.email.providers.mailersend.apiKey,
    });
  }

  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      const sentFrom = new Sender(emailData.from, envs.email.fromName);

      const recipients = Array.isArray(emailData.to)
        ? emailData.to.map((email) => new Recipient(email))
        : [new Recipient(emailData.to)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(emailData.subject);

      if (emailData.html) emailParams.setHtml(emailData.html);

      if (emailData.text) emailParams.setText(emailData.text);

      // Si solo hay HTML, también enviar una versión de texto básica
      if (emailData.html && !emailData.text) {
        // Convertir HTML básico a texto (remover tags)
        const textVersion = emailData.html
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        emailParams.setText(textVersion);
      }
      await this.mailerSend.email.send(emailParams);
      return {
        success: true,
        message: 'Email enviado exitosamente con MailerSend',
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw handleEmailProviderError(error, 'mailersend', SERVICE_NAME);
    }
  }
}

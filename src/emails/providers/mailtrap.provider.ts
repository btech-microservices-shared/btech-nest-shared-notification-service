import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from 'src/config/email.config';
import {
  EmailData,
  EmailProvider,
  EmailResult,
} from '../interfaces/email-provider.interface';
import { RpcException } from '@nestjs/microservices';
import { handleEmailProviderError } from '../helpers/handle-email-provider-error.helper';
import { SERVICE_NAME } from 'src/config/constants';

@Injectable()
export class MailtrapProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.email.providers.mailtrap.host,
      port: envs.email.providers.mailtrap.port,
      secure: false,
      auth: {
        user: envs.email.providers.mailtrap.user,
        pass: envs.email.providers.mailtrap.pass,
      },
    });
  }

  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      await this.transporter.sendMail(emailData);
      return {
        success: true,
        message: 'Email enviado exitosamente con Mailtrap',
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      // Crear y lanzar la excepción usando el helper
      throw handleEmailProviderError(error, 'mailtrap', SERVICE_NAME);
    }
  }
}

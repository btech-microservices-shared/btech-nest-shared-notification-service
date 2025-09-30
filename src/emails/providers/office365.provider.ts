import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {
  EmailData,
  EmailProvider,
  EmailResult,
} from '../interfaces/email-provider.interface';
import { RpcException } from '@nestjs/microservices';
import { handleEmailProviderError } from '../helpers/handle-email-provider-error.helper';
import { SERVICE_NAME } from 'src/config/constants';
import { envs } from 'src/config/env.config';

@Injectable()
export class Office365Provider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.email.providers.office365.host,
      port: envs.email.providers.office365.port,
      secure: envs.email.providers.office365.secure,
      requireTLS: envs.email.providers.office365.requireTLS,
      auth: {
        user: envs.email.providers.office365.user,
        pass: envs.email.providers.office365.pass,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
  }

  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      await this.transporter.sendMail(emailData);
      return {
        success: true,
        message: 'Email enviado exitosamente con Office365',
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      // Crear y lanzar la excepción usando el helper
      throw handleEmailProviderError(error, 'office365', SERVICE_NAME);
    }
  }
}

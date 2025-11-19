/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { EmailServerConfig } from '../entities/email-server-config.entity';

@Injectable()
export class DynamicSmtpProvider implements EmailProvider {
  /**
   * Crea un transporter din├ímico basado en la configuraci├│n del tenant
   */
  private createTransporter(config: EmailServerConfig): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: config.requireTLS,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
  }

  /**
   * Env├şa un email utilizando la configuraci├│n espec├şfica del tenant
   */
  async sendEmail(
    emailData: EmailData,
    config: EmailServerConfig,
  ): Promise<EmailResult> {
    try {
      const transporter = this.createTransporter(config);
      const mailOptions = {
        from:
          config.fromEmail && config.fromName
            ? `${config.fromName} <${config.fromEmail}>`
            : emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        headers: emailData.headers || {}, // ← DESCOMENTAR ESTA LÍNEA
      };
      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        message: 'Email enviado exitosamente',
        messageId: info.messageId,
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw handleEmailProviderError(error, `dynamic`, SERVICE_NAME);
    }
  }
}

import { Headers } from 'nodemailer/lib/mailer';

export type EmailHeaders = Headers;

export interface EmailProvider {
  sendEmail(emailData: EmailData, config?: any): Promise<EmailResult>;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers?: EmailHeaders;
}

export interface EmailResult {
  success: boolean;
  message: string;
  error?: string;
  messageId?: string;
}

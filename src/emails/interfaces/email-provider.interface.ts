export interface EmailProvider {
  sendEmail(emailData: EmailData, config?: any): Promise<EmailResult>;
}

export interface EmailHeaders {
  'In-Reply-To'?: string;
  References?: string;
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

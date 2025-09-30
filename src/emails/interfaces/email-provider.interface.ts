export interface EmailProvider {
  sendEmail(emailData: EmailData, config?: any): Promise<EmailResult>;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  error?: string;
}

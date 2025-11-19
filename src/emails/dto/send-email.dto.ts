import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { EmailHeaders } from '../interfaces/email-provider.interface';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsOptional()
  @IsObject()
  headers?: EmailHeaders;
}

export interface SendEmailResponseDto {
  success: boolean;
  message: string;
  error?: string;
  messageId?: string;
}

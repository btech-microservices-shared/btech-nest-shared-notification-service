import { HttpStatus, Injectable } from '@nestjs/common';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { MailtrapProvider } from '../providers/mailtrap.provider';
import { RpcException } from '@nestjs/microservices';
import { MailerSendProvider } from '../providers/mailersend.provider';
import { Office365Provider } from '../providers/office365.provider';

@Injectable()
export class EmailProviderFactory {
  private providers: Map<string, EmailProvider> = new Map();

  constructor(
    private readonly mailtrapProvider: MailtrapProvider,
    private readonly mailerSendProvider: MailerSendProvider,
    private readonly office365Provider: Office365Provider,
  ) {
    this.providers.set('mailtrap', this.mailtrapProvider);
    this.providers.set('mailersend', this.mailerSendProvider);
    this.providers.set('office365', this.office365Provider);
  }

  getProvider(providerName: string): EmailProvider {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró el proveedor de email ${providerName}`,
      });
    }
    return provider;
  }

  getAllProviders(): EmailProvider[] {
    return Array.from(this.providers.values());
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { MailtrapProvider } from '../providers/mailtrap.provider';
import { RpcException } from '@nestjs/microservices';
import { MailerSendProvider } from '../providers/mailersend.provider';

@Injectable()
export class EmailProviderFactory {
  private providers: Map<string, EmailProvider> = new Map();

  constructor(
    private readonly mailtrapProvider: MailtrapProvider,
    private readonly mailerSendProvider: MailerSendProvider,
  ) {
    this.providers.set('mailtrap', this.mailtrapProvider);
    this.providers.set('mailersend', this.mailerSendProvider);
  }

  getProvider(providerName: string): EmailProvider {
    const provider = this.providers.get(providerName);
    if (!provider)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El proveedor ${providerName} no existe. Proveedores disponibles: ${Array.from(this.providers.keys()).join(', ')}`,
      });
    return provider;
  }

  getAllProviders(): EmailProvider[] {
    return Array.from(this.providers.values());
  }
}

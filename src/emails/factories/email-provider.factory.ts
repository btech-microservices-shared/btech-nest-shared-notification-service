import { HttpStatus, Injectable } from '@nestjs/common';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { MailtrapProvider } from '../providers/mailtrap.provider';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EmailProviderFactory {
  private providers: Map<string, EmailProvider> = new Map();

  constructor(private readonly mailtrapProvider: MailtrapProvider) {
    this.providers.set('mailtrap', this.mailtrapProvider);
  }

  getProvider(providerName: string): EmailProvider {
    const provider = this.providers.get(providerName);
    if (!provider)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El proveedor ${providerName} no existe`,
      });
    return provider;
  }

  getAllProviders(): EmailProvider[] {
    return Array.from(this.providers.values());
  }
}

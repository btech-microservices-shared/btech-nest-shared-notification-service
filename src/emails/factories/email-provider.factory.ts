import { HttpStatus, Injectable } from '@nestjs/common';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { RpcException } from '@nestjs/microservices';
import { Office365Provider } from '../providers/office365.provider';
import { DynamicSmtpProvider } from '../providers/dynamic-smtp.provider';
import { EmailServerConfigService } from '../services/email-server-config.service';
import { EmailServerConfig } from '../entities/email-server-config.entity';

@Injectable()
export class EmailProviderFactory {
  private providers: Map<string, EmailProvider> = new Map();

  constructor(
    private readonly office365Provider: Office365Provider,
    private readonly dynamicSmtpProvider: DynamicSmtpProvider,
    private readonly emailServerConfigService: EmailServerConfigService,
  ) {
    this.providers.set('office365', this.office365Provider);
  }

  /**
   * Obtiene el proveedor por nombre (para compatibilidad con código existente)
   */
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

  /**
   * Obtiene el proveedor basado en el subscriptionDetailId del tenant
   * Si el tenant tiene configuración propia, usa DynamicSmtpProvider
   * Si no tiene configuración, usa el proveedor por defecto (Office365)
   */
  async getProviderForTenant(subscriptionDetailId: string): Promise<{
    provider: EmailProvider | DynamicSmtpProvider;
    config?: EmailServerConfig;
  }> {
    // Buscar configuración del tenant
    const tenantConfig =
      await this.emailServerConfigService.findBySubscriptionDetailId(
        subscriptionDetailId,
      );

    // Si el tenant tiene configuración, usar DynamicSmtpProvider
    if (tenantConfig) {
      return {
        provider: this.dynamicSmtpProvider,
        config: tenantConfig,
      };
    }

    // Si no tiene configuración, usar el proveedor por defecto (Office365)
    return {
      provider: this.office365Provider,
    };
  }

  getAllProviders(): EmailProvider[] {
    return Array.from(this.providers.values());
  }
}

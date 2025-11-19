import { Injectable } from '@nestjs/common';
import { EmailProviderFactory } from '../factories/email-provider.factory';
import { SendEmailService } from './send-email.service';
import { SendPasswordRecoveryEmailDto } from '../dto/send-password-recovery-email.dto';
import { SendEmailDto, SendEmailResponseDto } from '../dto/send-email.dto';
import { buildPasswordRecoveryEmail } from '../templates/access/build-password-recovery-email.template';
import { envs } from 'src/config';
import { SendPasswordRecoveryConfirmationDto } from '../dto/send-password-recovery-confirmation.dto';
import { buildPasswordRecoveryConfirmationEmail } from '../templates/access/build-password-recovery-confirmation.template';
import { SendInitialPasswordConfirmationDto } from '../dto/send-initial-password-confirmation.dto';
import { buildInitialPasswordConfirmationEmail } from '../templates/access/build-initial-password-confirmation.template';
import { SendPasswordChangeConfirmationDto } from '../dto/send-password-change-confirmation.dto';
import { buildPasswordChangeConfirmationEmail } from '../templates/access/build-password-change-confirmation.template';
import { SendUserRegistrationEmailDto } from '../dto/send-user-registration-email.dto';
import { buildUserRegistrationEmail } from '../templates/access/build-user-registration-email.template';

@Injectable()
export class EmailAccessService {
  constructor(
    private readonly emailProviderFactory: EmailProviderFactory,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async sendPasswordRecoveryEmail(
    dto: SendPasswordRecoveryEmailDto,
  ): Promise<SendEmailResponseDto> {
    // Obtener la configuración del tenant para verificar si tiene logo personalizado
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildPasswordRecoveryEmail({
      fullName: dto.fullName,
      username: dto.username,
      pin: dto.pin,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Recuperación de Contraseña',
      html,
    };
    // Si no tiene subscriptionDetailId, usar el proveedor por defecto
    return this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendPasswordRecoveryConfirmation(
    dto: SendPasswordRecoveryConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildPasswordRecoveryConfirmationEmail({
      fullName: dto.fullName,
      username: dto.username,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Contraseña Recuperada Exitosamente',
      html,
    };
    return this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendInitialPasswordConfirmation(
    dto: SendInitialPasswordConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildInitialPasswordConfirmationEmail({
      fullName: dto.fullName,
      username: dto.username,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Contraseña Inicial Configurada',
      html,
    };
    return this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendPasswordChangeConfirmation(
    dto: SendPasswordChangeConfirmationDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildPasswordChangeConfirmationEmail({
      fullName: dto.fullName,
      username: dto.username,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Contraseña Actualizada Exitosamente',
      html,
    };
    return this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }

  async sendUserRegistrationEmail(
    dto: SendUserRegistrationEmailDto,
  ): Promise<SendEmailResponseDto> {
    const { config } = dto.subscriptionDetailId
      ? await this.emailProviderFactory.getProviderForTenant(
          dto.subscriptionDetailId,
        )
      : { config: null };
    const logoUrl = config?.logoUrl || dto.logoUrl;
    const html = buildUserRegistrationEmail({
      fullName: dto.fullName,
      username: dto.username,
      password: dto.password,
      role: dto.role,
      codeService: dto.codeService,
      companyName: dto.companyName,
      logoUrl,
      primaryColor: dto.primaryColor,
    });
    const emailData: SendEmailDto = {
      from: `${envs.email.fromName} <${envs.email.from}>`,
      to: dto.email,
      subject: 'Bienvenido - Tu Cuenta Ha Sido Creada',
      html,
    };
    return this.sendEmailService.execute(
      emailData,
      dto.subscriptionDetailId || 'default-provider',
    );
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsController } from './emails.controller';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { Office365Provider } from './providers/office365.provider';
import { DynamicSmtpProvider } from './providers/dynamic-smtp.provider';
import { EmailServerConfig } from './entities/email-server-config.entity';
import { SentEmail } from './entities/sent-email.entity';
import { EMAIL_SERVICES } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([EmailServerConfig, SentEmail])],
  controllers: [EmailsController],
  providers: [
    EmailProviderFactory,
    Office365Provider,
    DynamicSmtpProvider,
    ...EMAIL_SERVICES,
  ],
  exports: [...EMAIL_SERVICES],
})
export class EmailsModule {}

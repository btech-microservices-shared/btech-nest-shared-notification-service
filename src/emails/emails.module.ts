import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { Office365Provider } from './providers/office365.provider';
import { DynamicSmtpProvider } from './providers/dynamic-smtp.provider';
import { EmailServerConfigService } from './services/email-server-config.service';
import { EmailServerConfig } from './entities/email-server-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailServerConfig])],
  controllers: [EmailsController],
  providers: [
    EmailsService,
    EmailProviderFactory,
    Office365Provider,
    DynamicSmtpProvider,
    EmailServerConfigService,
  ],
})
export class EmailsModule {}

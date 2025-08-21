import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { MailtrapProvider } from './providers/mailtrap.provider';
import { MailerSendProvider } from './providers/mailersend.provider';
import { Office365Provider } from './providers/office365.provider';

@Module({
  controllers: [EmailsController],
  providers: [
    EmailsService,
    EmailProviderFactory,
    MailtrapProvider,
    MailerSendProvider,
    Office365Provider,
  ],
})
export class EmailsModule {}

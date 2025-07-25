import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { EmailProviderFactory } from './factories/email-provider.factory';
import { MailtrapProvider } from './providers/mailtrap.provider';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService, EmailProviderFactory, MailtrapProvider],
})
export class EmailsModule {}

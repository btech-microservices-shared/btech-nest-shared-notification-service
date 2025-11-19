export * from './email-access.service';
export * from './email-support.service';
export * from './email-vdi.service';
export * from './email-server-config.service';
export * from './sent-email.service';
export * from './send-email.service';

import { EmailAccessService } from './email-access.service';
import { EmailSupportService } from './email-support.service';
import { EmailVdiService } from './email-vdi.service';
import { EmailServerConfigService } from './email-server-config.service';
import { SentEmailService } from './sent-email.service';
import { SendEmailService } from './send-email.service';

export const EMAIL_SERVICES = [
  EmailAccessService,
  EmailSupportService,
  EmailVdiService,
  EmailServerConfigService,
  SentEmailService,
  SendEmailService,
];

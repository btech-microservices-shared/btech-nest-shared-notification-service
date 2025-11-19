/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentEmail } from '../entities/sent-email.entity';
import { EmailHeaders } from '../interfaces/email-provider.interface';

@Injectable()
export class SentEmailService {
  private readonly logger = new Logger(SentEmailService.name);
  constructor(
    @InjectRepository(SentEmail)
    private readonly sentEmailRepository: Repository<SentEmail>,
  ) {}

  async create(
    messageId: string,
    referenceId: string,
    referenceType: string,
  ): Promise<void> {
    try {
      const sentEmail = this.sentEmailRepository.create({
        messageId,
        referenceId,
        referenceType,
      });
      await this.sentEmailRepository.save(sentEmail);
      this.logger.log(
        `Email messageId ${messageId} saved for ${referenceType} ${referenceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to save email messageId for ${referenceType} ${referenceId}`,
        error.stack,
      );
    }
  }

  async getHeadersForReply(
    referenceId: string,
    referenceType: string,
  ): Promise<EmailHeaders | undefined> {
    try {
      const sentEmail = await this.sentEmailRepository.findOne({
        where: { referenceId, referenceType },
        order: { createdAt: 'ASC' },
      });

      if (sentEmail) {
        this.logger.log(
          `Found original email for ${referenceType} ${referenceId}. Message-ID: ${sentEmail.messageId}`,
        );
        return {
          'In-Reply-To': sentEmail.messageId,
          References: sentEmail.messageId,
        };
      }
      this.logger.warn(
        `No original email found for ${referenceType} ${referenceId}. Sending as new email.`,
      );
    } catch (error) {
      this.logger.error(
        `Error fetching headers for ${referenceType} ${referenceId}`,
        error.stack,
      );
    }
    return undefined;
  }
}

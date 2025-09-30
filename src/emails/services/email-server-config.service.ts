import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailServerConfig } from '../entities/email-server-config.entity';

@Injectable()
export class EmailServerConfigService {
  constructor(
    @InjectRepository(EmailServerConfig)
    private readonly emailServerConfigRepository: Repository<EmailServerConfig>,
  ) {}

  async findBySubscriptionDetailId(
    subscriptionDetailId: string,
  ): Promise<EmailServerConfig | null> {
    return this.emailServerConfigRepository.findOne({
      where: {
        subscriptionDetailId,
        isActive: true,
      },
    });
  }

  async create(
    configData: Partial<EmailServerConfig>,
  ): Promise<EmailServerConfig> {
    const config = this.emailServerConfigRepository.create(configData);
    return this.emailServerConfigRepository.save(config);
  }

  async update(
    id: string,
    configData: Partial<EmailServerConfig>,
  ): Promise<EmailServerConfig | null> {
    await this.emailServerConfigRepository.update(id, configData);
    return this.emailServerConfigRepository.findOne({
      where: { emailServerConfigId: id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.emailServerConfigRepository.delete(id);
  }
}

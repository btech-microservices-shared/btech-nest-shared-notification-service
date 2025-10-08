import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuditService } from '../interfaces';
import { CreateAuditLogDto, CreateAuditLogResponseDto } from '../dto';
import { AUDIT_SERVICE } from 'src/config';

@Injectable()
export class AuditClient implements OnModuleInit {
  private auditService: AuditService;

  constructor(
    @Inject(AUDIT_SERVICE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.auditService = this.client.getService<AuditService>('AuditService');
  }

  async createAuditLog(
    request: CreateAuditLogDto,
  ): Promise<CreateAuditLogResponseDto> {
    return await lastValueFrom(this.auditService.createAuditLog(request));
  }
}

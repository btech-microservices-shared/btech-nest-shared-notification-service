import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IAuditService } from '../interfaces/audit-service.interface';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { CreateAuditLogResponseDto } from '../dto';
import { AUDIT_SERVICE } from 'src/config/constants';

@Injectable()
export class AuditClient implements OnModuleInit {
  private auditService: IAuditService;

  constructor(
    @Inject(AUDIT_SERVICE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.auditService = this.client.getService<IAuditService>('AuditService');
  }

  async createAuditLog(
    request: CreateAuditLogDto,
  ): Promise<CreateAuditLogResponseDto> {
    return await lastValueFrom(this.auditService.createAuditLog(request));
  }
}

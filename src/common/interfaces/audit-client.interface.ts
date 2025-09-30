import { CreateAuditLogDto } from '../dto';

export interface IAuditClient {
  logAction(data: CreateAuditLogDto): void;
}

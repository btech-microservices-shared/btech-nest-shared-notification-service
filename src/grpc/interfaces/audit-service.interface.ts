import { Observable } from 'rxjs';
import { CreateAuditLogDto, CreateAuditLogResponseDto } from '../dto';

export interface AuditService {
  createAuditLog(
    request: CreateAuditLogDto,
  ): Observable<CreateAuditLogResponseDto>;
}

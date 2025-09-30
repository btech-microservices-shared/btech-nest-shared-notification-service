import { Observable } from 'rxjs';
import { CreateAuditLogDto, CreateAuditLogResponseDto } from '../dto';

export interface IAuditService {
  createAuditLog(
    request: CreateAuditLogDto,
  ): Observable<CreateAuditLogResponseDto>;
}

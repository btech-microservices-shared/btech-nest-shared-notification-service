import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuditClient } from '../clients';
import { createAuditDataFormatted } from '../helpers';
import { SendLabReservationEmailDetailsDto } from 'src/emails/dto/send-lab-reservation-email.dto';
import { SendSupportTicketsEmailDto } from 'src/emails/dto/send-support-tickets-email.dto';

import type { ServerUnaryCall, Metadata } from '@grpc/grpc-js';

interface ErrorWithStatus extends Error {
  status?: number;
}

type EmailPayload =
  | SendLabReservationEmailDetailsDto
  | SendSupportTicketsEmailDto;

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditClient: AuditClient) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();

    const payload = context.switchToRpc().getData<EmailPayload>();

    const rpcContext = context
      .switchToRpc()
      .getContext<ServerUnaryCall<EmailPayload, unknown>>();

    const metadata: Metadata = rpcContext.metadata;
    const projectName = (metadata.get('project')[0] as string) ?? 'unknown';
    const traceId =
      (metadata.get('x-trace-id')[0] as string) ??
      (metadata.get('x-request-id')[0] as string) ??
      undefined;

    const handlerName = context.getHandler().name;
    const serviceName = context.getClass().name;

    return next.handle().pipe(
      tap(() => {
        const responseTimeMs = Date.now() - startTime;

        const auditData = createAuditDataFormatted({
          method: handlerName,
          route: serviceName,
          serviceName: 'email-service',
          projectName,
          userId: 'anonymous',
          ipAddress: '0.0.0.0',
          userAgent: undefined,
          requestBody: JSON.stringify(payload),
          responseBody: undefined,
          statusCode: 0, // gRPC OK
          errorMessage: undefined,
          responseTimeMs,
          metadata: Object.fromEntries(
            Object.entries(metadata.getMap()).map(([key, value]) => [
              key,
              Array.isArray(value)
                ? value
                    .map((v) =>
                      Buffer.isBuffer(v) ? v.toString('utf8') : String(v),
                    )
                    .join(',')
                : Buffer.isBuffer(value)
                  ? value.toString('utf8')
                  : String(value),
            ]),
          ),
          sessionId: 'anonymous',
          traceId,
        });

        this.auditClient.logAction(auditData);
      }),
      catchError((error: ErrorWithStatus) => {
        const responseTimeMs = Date.now() - startTime;

        const auditData = createAuditDataFormatted({
          method: handlerName,
          route: serviceName,
          serviceName: 'email-service',
          projectName,
          userId: 'anonymous',
          ipAddress: '0.0.0.0',
          userAgent: undefined,
          requestBody: JSON.stringify(payload),
          responseBody: undefined,
          statusCode: error?.status || 13,
          errorMessage: error?.message || 'Error desconocido',
          responseTimeMs,
          metadata: Object.fromEntries(
            Object.entries(metadata.getMap()).map(([key, value]) => [
              key,
              Array.isArray(value)
                ? value
                    .map((v) =>
                      Buffer.isBuffer(v) ? v.toString('utf8') : String(v),
                    )
                    .join(',')
                : Buffer.isBuffer(value)
                  ? value.toString('utf8')
                  : String(value),
            ]),
          ),
          sessionId: 'anonymous',
          traceId,
        });

        this.auditClient.logAction(auditData);

        return throwError(() => error);
      }),
    );
  }
}

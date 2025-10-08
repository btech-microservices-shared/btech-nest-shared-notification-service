import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, mergeMap, throwError } from 'rxjs';
import { AuditClient } from '../../grpc/clients';
import { createAuditDataFormatted } from '../helpers';
import { SendLabReservationEmailDetailsDto } from 'src/emails/dto/send-lab-reservation-email.dto';
import { SendSupportTicketsEmailDto } from 'src/emails/dto/send-support-tickets-email.dto';
import type { ServerUnaryCall, Metadata } from '@grpc/grpc-js';
import { CustomLog } from '../utils';

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

    const metadata: Metadata = rpcContext?.metadata;
    const projectName = (metadata?.get('project')?.[0] as string) ?? 'unknown';
    const traceId =
      (metadata?.get('x-trace-id')?.[0] as string) ??
      (metadata?.get('x-request-id')?.[0] as string) ??
      undefined;

    const handlerName = context.getHandler().name;
    const serviceName = context.getClass().name;

    return next.handle().pipe(
      mergeMap(async (response: unknown) => {
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
          statusCode: 0,
          errorMessage: undefined,
          responseTimeMs,
          metadata: metadata
            ? Object.fromEntries(
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
              )
            : {},
          sessionId: 'anonymous',
          traceId,
        });

        CustomLog(
          'debug',
          AuditInterceptor.name,
          'enviando auditoria...',
          auditData,
        );

        try {
          await this.auditClient.createAuditLog(auditData);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Error al enviar log de auditoría';
          // No fallar si el servicio de auditoría está caído
          console.error('Error enviando log de auditoría:', errorMessage);
        }

        return response;
      }),
      catchError(async (error: ErrorWithStatus) => {
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
          metadata: metadata
            ? Object.fromEntries(
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
              )
            : {},
          sessionId: 'anonymous',
          traceId,
        });

        try {
          await this.auditClient.createAuditLog(auditData);
        } catch (auditError) {
          // No fallar si el servicio de auditoría está caído
          const errorMessage =
            auditError instanceof Error
              ? auditError.message
              : 'Error al enviar log de auditoría';
          console.error(
            'Error enviando log de auditoría (error):',
            errorMessage,
          );
        }

        return throwError(() => error);
      }),
    );
  }
}

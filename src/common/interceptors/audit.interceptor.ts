/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError, finalize } from 'rxjs';
import { AuditClient } from '../../grpc/clients';
import { createAuditDataFormatted } from '../helpers';
import { SendLabReservationEmailDetailsDto } from 'src/emails/dto/send-lab-reservation-email.dto';
import { SendSupportTicketsEmailDto } from 'src/emails/dto/send-support-tickets-email.dto';
import type { ServerUnaryCall, Metadata } from '@grpc/grpc-js';
import { CustomLog } from '../utils';
import { envs } from '../../config';
import { EmailServerConfigService } from 'src/emails/services/email-server-config.service';

interface ErrorWithStatus extends Error {
  status?: number;
}

type EmailPayload =
  | SendLabReservationEmailDetailsDto
  | SendSupportTicketsEmailDto;

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditClient: AuditClient,
    private readonly emailServerConfigService: EmailServerConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();

    const payload = context.switchToRpc().getData<EmailPayload>();

    const rpcContext = context
      .switchToRpc()
      .getContext<ServerUnaryCall<EmailPayload, unknown>>();

    const metadata: Metadata = rpcContext?.metadata;
    const projectName = (metadata?.get('project')?.[0] as string) ?? 'VDI';
    const traceId =
      (metadata?.get('x-trace-id')?.[0] as string) ??
      (metadata?.get('x-request-id')?.[0] as string) ??
      undefined;

    const handlerName = context.getHandler().name;
    const serviceName = context.getClass().name;

    let hasError = false;
    let capturedError: ErrorWithStatus | null = null;
    let responseData: unknown = null;

    return next.handle().pipe(
      tap((response) => {
        // Marcar como exitoso y capturar la respuesta
        hasError = false;
        responseData = response;
      }),
      catchError((error: ErrorWithStatus) => {
        // Capturar el error
        hasError = true;
        capturedError = error;
        return throwError(() => error);
      }),
      finalize(() => {
        // Ejecutar después de que el observable termine (éxito o error)
        const responseTimeMs = Date.now() - startTime;

        // Obtener el correo de origen de forma asíncrona (fire and forget)
        this.getEmailFromAndSendAudit({
          payload,
          handlerName,
          serviceName,
          projectName,
          hasError,
          capturedError,
          responseData,
          responseTimeMs,
          metadata,
          traceId,
        });
      }),
    );
  }

  private async getEmailFromAndSendAudit(params: {
    payload: EmailPayload;
    handlerName: string;
    serviceName: string;
    projectName: string;
    hasError: boolean;
    capturedError: ErrorWithStatus | null;
    responseData: unknown;
    responseTimeMs: number;
    metadata: Metadata;
    traceId?: string;
  }): Promise<void> {
    try {
      const {
        payload,
        handlerName,
        serviceName,
        projectName,
        hasError,
        capturedError,
        responseData,
        responseTimeMs,
        metadata,
        traceId,
      } = params;

      // Valores por defecto
      let emailFrom = envs.email.from;
      let emailFromName = envs.email.fromName;

      // Intentar obtener la configuración del tenant si existe subscriptionDetailId
      if (
        payload &&
        'subscriptionDetailId' in payload &&
        payload.subscriptionDetailId
      ) {
        try {
          const tenantConfig =
            await this.emailServerConfigService.findBySubscriptionDetailId(
              payload.subscriptionDetailId,
            );
          if (tenantConfig?.fromEmail) {
            emailFrom = tenantConfig.fromEmail;
          }
          if (tenantConfig?.fromName) {
            emailFromName = tenantConfig.fromName;
          }
        } catch (error) {
          // Si hay error al obtener la config, usar valores por defecto
          CustomLog(
            'warn',
            AuditInterceptor.name,
            'Error al obtener configuración del tenant, usando valores por defecto',
          );
        }
      }

      // Agregar la información del correo de origen al payload
      const enrichedPayload = {
        ...payload,
        emailFrom: `${emailFromName} <${emailFrom}>`,
      };

      // Construir el responseBody dependiendo si hubo error o éxito
      let responseBody: string | undefined;
      if (hasError) {
        responseBody = JSON.stringify({
          success: false,
          message: capturedError?.message || 'Error desconocido',
        });
      } else if (responseData) {
        responseBody = JSON.stringify(responseData);
      }

      const auditData = createAuditDataFormatted({
        method: handlerName,
        route: serviceName,
        serviceName: 'email-service',
        projectName,
        userId: 'anonymous',
        ipAddress: '0.0.0.0',
        userAgent: undefined,
        requestBody: JSON.stringify(enrichedPayload),
        responseBody,
        statusCode: hasError ? capturedError?.status || 13 : 0,
        errorMessage: hasError
          ? capturedError?.message || 'Error desconocido'
          : undefined,
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

      // Enviar el log de auditoría
      await this.auditClient.createAuditLog(auditData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al enviar log de auditoría';
      console.error('Error enviando log de auditoría:', errorMessage);
    }
  }
}

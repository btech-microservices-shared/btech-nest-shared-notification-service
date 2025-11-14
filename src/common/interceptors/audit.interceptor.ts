/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError, finalize } from 'rxjs';
import type { ServerUnaryCall, Metadata } from '@grpc/grpc-js';
import { AuditClient } from '../../grpc/clients';
import { createAuditDataFormatted } from '../helpers';
import { CustomLog } from '../utils';
import { envs } from '../../config';
import { EmailServerConfigService } from 'src/emails/services/email-server-config.service';
import { SendLabReservationEmailDetailsDto } from 'src/emails/dto/send-lab-reservation-email.dto';

import { GrpcMetadataDto } from 'src/emails/dto/grpc-metadata.dto';
import { SendCreatedTicketEmailDto } from 'src/emails/dto/send-created-ticket-email.dto';

interface ErrorWithStatus extends Error {
  status?: number;
}

type EmailPayload =
  | SendLabReservationEmailDetailsDto
  | SendCreatedTicketEmailDto;

interface PayloadWithGrpcMetadata {
  grpcMetadata?: GrpcMetadataDto;
  [key: string]: any;
}

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

    // Obtener grpcMetadata del payload si existe
    const grpcMetadata = (payload as PayloadWithGrpcMetadata)?.grpcMetadata;

    const projectName = (metadata?.get('project')?.[0] as string) ?? 'VDI';
    const traceId =
      (metadata?.get('x-trace-id')?.[0] as string) ??
      (metadata?.get('x-request-id')?.[0] as string) ??
      undefined;
    const ipAddress =
      grpcMetadata?.ipAddress ||
      (metadata?.get('x-client-ip')?.[0] as string) ||
      '127.0.0.1';
    const userAgent =
      grpcMetadata?.userAgent ||
      (metadata?.get('x-user-agent')?.[0] as string) ||
      'system-scheduler';
    const subscriberId =
      grpcMetadata?.subscriberId ||
      (metadata?.get('x-subscriber-id')?.[0] as string) ||
      'system';

    const handlerName = context.getHandler().name;
    const serviceName = context.getClass().name;

    let hasError = false;
    let capturedError: ErrorWithStatus | null = null;
    let responseData: unknown = null;

    return next.handle().pipe(
      tap((response) => {
        hasError = false;
        responseData = response;
      }),
      catchError((error: ErrorWithStatus) => {
        hasError = true;
        capturedError = error;
        return throwError(() => error);
      }),
      finalize(() => {
        const responseTimeMs = Date.now() - startTime;

        this.sendAuditLog({
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
          ipAddress,
          userAgent,
          subscriberId,
        });
      }),
    );
  }

  private async sendAuditLog(params: {
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
    ipAddress: string;
    userAgent?: string;
    subscriberId: string;
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
        ipAddress,
        userAgent,
        subscriberId,
      } = params;

      const { emailFrom, emailFromName } =
        await this.getEmailFromConfig(payload);

      // Crear una copia del payload sin grpcMetadata
      const { grpcMetadata: _, ...payloadWithoutMetadata } =
        payload as PayloadWithGrpcMetadata;

      // Agregar la información del correo de origen al payload
      const enrichedPayload = {
        ...payloadWithoutMetadata,
        emailFrom: `${emailFromName} <${emailFrom}>`,
      };

      // Construir el responseBody dependiendo si hubo error o éxito
      const responseBody = hasError
        ? JSON.stringify({
            success: false,
            message: capturedError?.message || 'Error desconocido',
          })
        : responseData
          ? JSON.stringify(responseData)
          : undefined;

      // Construir el route en formato gRPC estándar: /package.Service/Method
      const grpcMethod = this.getGrpcMethodFromHandler(handlerName);
      const grpcRoute = `/emails.EmailsService/${grpcMethod}`;

      const auditData = createAuditDataFormatted({
        method: 'GRPC',
        route: grpcRoute,
        serviceName: 'email-service',
        projectName,
        userId: subscriberId,
        ipAddress,
        userAgent,
        requestBody: JSON.stringify(enrichedPayload),
        responseBody,
        statusCode: hasError ? capturedError?.status || 500 : 200,
        errorMessage: hasError ? capturedError?.message : undefined,
        responseTimeMs,
        metadata: this.formatMetadata(metadata),
        sessionId: 'anonymous',
        traceId,
      });

      await this.auditClient.createAuditLog(auditData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al enviar log de auditoría';
      console.error('Error enviando log de auditoría:', errorMessage);
    }
  }

  private async getEmailFromConfig(
    payload: EmailPayload,
  ): Promise<{ emailFrom: string; emailFromName: string }> {
    let emailFrom = envs.email.from;
    let emailFromName = envs.email.fromName;

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
        CustomLog(
          'warn',
          AuditInterceptor.name,
          'Error al obtener configuración del tenant, usando valores por defecto',
        );
      }
    }

    return { emailFrom, emailFromName };
  }

  private formatMetadata(metadata: Metadata): Record<string, string> {
    if (!metadata) return {};

    return Object.fromEntries(
      Object.entries(metadata.getMap()).map(([key, value]) => [
        key,
        Array.isArray(value)
          ? value
              .map((v) => (Buffer.isBuffer(v) ? v.toString('utf8') : String(v)))
              .join(',')
          : Buffer.isBuffer(value)
            ? value.toString('utf8')
            : String(value),
      ]),
    );
  }

  /**
   * Mapea el nombre del handler de NestJS al nombre del RPC definido en el proto
   * Convierte camelCase a PascalCase para coincidir con el formato del proto
   */
  private getGrpcMethodFromHandler(handlerName: string): string {
    // El handlerName ya viene en camelCase (ej: sendLabReservationEmail)
    // El proto usa PascalCase (ej: SendLabReservationEmail)
    return handlerName.charAt(0).toUpperCase() + handlerName.slice(1);
  }
}

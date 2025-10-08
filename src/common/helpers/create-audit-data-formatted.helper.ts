import { CreateAuditLogDto } from '../../grpc/dto';

export const createAuditDataFormatted = (
  data: CreateAuditLogDto,
): CreateAuditLogDto => {
  return {
    serviceName: data.serviceName ? data.serviceName : 'unknown_service',
    projectName: data.projectName ? data.projectName : 'unknown_project',
    method: data.method,
    route: data.route,
    userId: data.userId ? data.userId : 'anonymous',
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    requestBody: data.requestBody ? data.requestBody : undefined,
    responseBody: data.responseBody ? data.responseBody : undefined,
    statusCode: data.statusCode,
    errorMessage: data.errorMessage,
    responseTimeMs: data.responseTimeMs,
    metadata: data.metadata ? data.metadata : {},
    sessionId: data.sessionId ? data.sessionId : 'anonymous',
    traceId: data.traceId ? data.traceId : 'anonymous',
  };
};

import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
  IsObject,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIP,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAuditLogDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  serviceName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  projectName: string;

  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'subscriptionDetailId debe ser un UUID v4 válido' })
  subscriptionDetailId?: string;

  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'subscriptionBussineId debe ser un UUID v4 válido' })
  subscriptionBussineId?: string;

  @IsNotEmpty()
  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  route?: string;

  @IsString()
  @IsUUID('4', { message: 'userId debe ser un UUID v4 válido' })
  userId: string;

  @IsOptional()
  @IsString()
  @IsIP('4', { message: 'La dirección IP debe ser una dirección IPv4 válida' })
  ipAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  userAgent?: string;

  @IsOptional()
  @IsString()
  requestBody?: string;

  @IsOptional()
  @IsString()
  responseBody?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  statusCode?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  errorMessage?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  responseTimeMs?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  metadata?: Record<string, string>;

  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'sessionId debe ser un UUID válido' })
  sessionId?: string;

  @IsOptional()
  @IsUUID('all', { message: 'traceId debe ser un UUID válido (v3, v4 o v5)' })
  traceId?: string;
}

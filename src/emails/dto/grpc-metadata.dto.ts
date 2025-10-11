import { IsOptional, IsString } from 'class-validator';

export class GrpcMetadataDto {
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  subscriberId?: string;
}

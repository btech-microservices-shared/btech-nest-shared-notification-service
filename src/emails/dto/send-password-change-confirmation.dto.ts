import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GrpcMetadataDto } from './grpc-metadata.dto';

export class SendPasswordChangeConfirmationDto {
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido' },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;

  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  companyName: string;

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;

  @IsString({ message: 'La URL del logo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL del logo es obligatoria' })
  logoUrl: string;

  @IsOptional()
  @IsUUID('all', {
    message: 'El subscriptionDetailId debe ser un UUID válido',
  })
  subscriptionDetailId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GrpcMetadataDto)
  grpcMetadata?: GrpcMetadataDto;
}

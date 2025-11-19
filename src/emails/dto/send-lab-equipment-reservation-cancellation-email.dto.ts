import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GrpcMetadataDto } from './grpc-metadata.dto';

export class EmailNotificationDataDto {
  @IsString({ message: 'La URL del logo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL del logo es obligatoria' })
  logoUrl: string;

  @IsString({ message: 'La hora final debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora final es obligatoria' })
  finalHour: string;

  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  companyName: string;

  @IsString({ message: 'La hora inicial debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora inicial es obligatoria' })
  initialHour: string;

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;

  @IsString({
    message: 'El nombre del laboratorio debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El nombre del laboratorio es obligatorio' })
  laboratoryName: string;

  @IsString({
    message: 'El nombre del suscriptor debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El nombre del suscriptor es obligatorio' })
  subscriberName: string;

  @IsString({ message: 'La fecha de reservación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de reservación es obligatoria' })
  reservationDate: string;

  @IsEmail(
    {},
    {
      message:
        'El correo electrónico del suscriptor debe tener un formato válido',
    },
  )
  @IsNotEmpty({
    message: 'El correo electrónico del suscriptor es obligatorio',
  })
  subscriberEmail: string;
}

export class EmailNotificationMetadataDto {
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  @IsString({ message: 'La URL de acceso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL de acceso es obligatoria' })
  accessUrl: string;

  @IsObject({
    message: 'Los datos de notificación de email deben ser un objeto',
  })
  @IsNotEmpty({
    message: 'Los datos de notificación de email son obligatorios',
  })
  @ValidateNested()
  @Type(() => EmailNotificationDataDto)
  emailNotificationData: EmailNotificationDataDto;
}

export class SendLabEquipmentReservationCancellationEmailDto {
  @IsUUID('4', {
    message: 'El reservationLaboratoryEquipmentId debe ser un UUID válido',
  })
  @IsNotEmpty({
    message: 'El reservationLaboratoryEquipmentId es obligatorio',
  })
  reservationLaboratoryEquipmentId: string;

  @IsObject({ message: 'Los metadatos deben ser un objeto' })
  @IsNotEmpty({ message: 'Los metadatos son obligatorios' })
  @ValidateNested()
  @Type(() => EmailNotificationMetadataDto)
  metadata: EmailNotificationMetadataDto;

  @IsUUID('4', {
    message: 'El subscriptionDetailId debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El subscriptionDetailId es obligatorio' })
  subscriptionDetailId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GrpcMetadataDto)
  grpcMetadata?: GrpcMetadataDto;

  @IsUUID('all', { message: 'El ID de la reserva debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la reserva es obligatorio' })
  reservationId: string;
}

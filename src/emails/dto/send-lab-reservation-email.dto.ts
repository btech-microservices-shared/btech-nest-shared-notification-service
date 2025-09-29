import {
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendLabReservationEmailDto {
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido' },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  to: string;

  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  companyName: string;

  @IsString({ message: 'La URL del logo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL del logo es obligatoria' })
  logoUrl: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  userName: string;

  @IsString({ message: 'La fecha de reservación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de reservación es obligatoria' })
  reservationDate: string;

  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @IsNotEmpty({ message: 'Los detalles de la reservación son obligatorios' })
  @ValidateNested({ each: true })
  @Type(() => SendLabReservationEmailDetailsDto)
  details: SendLabReservationEmailDetailsDto[];

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;
}

export class SendLabReservationEmailDetailsDto {
  @IsString({
    message: 'La descripción del laboratorio debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'La descripción del laboratorio es obligatoria' })
  labDescription: string;

  @IsString({
    message: 'La descripción del equipo debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'La descripción del equipo es obligatoria' })
  equipmentDescription: string;

  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  startTime: string;

  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  endTime: string;

  @IsString({ message: 'La fecha debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  date: string;

  @IsObject({ message: 'Los metadatos deben ser un objeto' })
  @IsNotEmpty({ message: 'Los metadatos son obligatorios' })
  metadata: Record<string, any>;
}

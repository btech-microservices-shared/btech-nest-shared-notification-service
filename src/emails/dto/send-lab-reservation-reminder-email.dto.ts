import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';

export class SendLabReservationReminderEmailDto {
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

  @IsInt({ message: 'Los minutos de recordatorio deben ser un número entero' })
  @Min(1, { message: 'Los minutos de recordatorio deben ser al menos 1' })
  @IsNotEmpty({ message: 'Los minutos de recordatorio son obligatorios' })
  reminderMinutes: number;

  @IsString({ message: 'La fecha de reservación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de reservación es obligatoria' })
  reservationDate: string;

  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  startTime: string;

  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  endTime: string;

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

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;

  @IsUUID('all', {
    message: 'El subscriptionDetailId debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El subscriptionDetailId es obligatorio' })
  subscriptionDetailId: string;
}

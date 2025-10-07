import { IsString, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SendSupportTicketsEmailDto {
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

  @IsString({ message: 'El número del ticket debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número del ticket es obligatorio' })
  ticketNumber: string;

  @IsString({ message: 'El título del ticket debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título del ticket es obligatorio' })
  title: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsString({ message: 'La prioridad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La prioridad es obligatoria' })
  priority: string;

  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  status: string;

  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  type: string;

  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  category: string;

  @IsString({ message: 'La fecha de creación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de creación es obligatoria' })
  createdDate: string;

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;

  @IsUUID('all', {
    message: 'El subscriptionDetailId debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El subscriptionDetailId es obligatorio' })
  subscriptionDetailId: string;
}

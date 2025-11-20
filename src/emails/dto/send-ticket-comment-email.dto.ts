import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { GrpcMetadataDto } from './grpc-metadata.dto';
import { Type } from 'class-transformer';

export class SendTicketCommentEmailDto {
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

  @IsString({
    message: 'El nombre del usuario receptor debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El nombre del usuario receptor es obligatorio' })
  userName: string;

  @IsString({ message: 'El número del ticket debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número del ticket es obligatorio' })
  ticketNumber: string;

  @IsString({ message: 'El título del ticket debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título del ticket es obligatorio' })
  ticketTitle: string;

  @IsString({
    message: 'El nombre del autor del comentario debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El nombre del autor del comentario es obligatorio' })
  commentAuthor: string;

  @IsString({
    message: 'El contenido del comentario debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  commentContent: string;

  @IsString({ message: 'La fecha del comentario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha del comentario es obligatoria' })
  commentDate: string;

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;

  @IsString({ message: 'La URL del ticket debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL del ticket es obligatoria' })
  ticketUrl: string;

  @IsUUID('all', {
    message: 'El subscriptionDetailId debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El subscriptionDetailId es obligatorio' })
  subscriptionDetailId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GrpcMetadataDto)
  grpcMetadata?: GrpcMetadataDto;

  @IsOptional()
  @IsString({ message: 'El estado del ticket debe ser una cadena de texto' })
  ticketStatus?: string;
}

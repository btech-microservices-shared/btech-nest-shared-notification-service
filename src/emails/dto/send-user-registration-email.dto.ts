import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GrpcMetadataDto } from './grpc-metadata.dto';

export enum Role {
  CLI = 'CLI',
  ADM = 'ADM',
  SAS = 'SAS',
  SYS = 'SYS',
  ADC = 'ADC',
}

export enum CodeService {
  VDI = 'VDI',
  STO = 'STO',
  SUP = 'SUP',
}

export class SendUserRegistrationEmailDto {
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

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsEnum(Role, {
    message: 'El rol debe ser uno de los valores permitidos: CLI, ADM, SAS, SYS, ADC',
  })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role: Role;

  @IsEnum(CodeService, {
    message: 'El servicio debe ser uno de los valores permitidos: VDI, STO, SUP',
  })
  @IsNotEmpty({ message: 'El servicio es obligatorio' })
  codeService: CodeService;

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

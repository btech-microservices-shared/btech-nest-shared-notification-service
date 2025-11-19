import { Role, CodeService } from '../../dto/send-user-registration-email.dto';

const getRoleDisplayName = (role: Role): string => {
  const roleMap: Record<Role, string> = {
    [Role.CLI]: '', // No se especifica para clientes
    [Role.ADM]: 'Administrador',
    [Role.SAS]: 'Super Administrador',
    [Role.SYS]: 'Sistemas',
    [Role.ADC]: 'Administrador',
  };
  return roleMap[role];
};

const getServiceDisplayName = (codeService: CodeService): string => {
  const serviceMap: Record<CodeService, string> = {
    [CodeService.VDI]: 'Sistema de reservas',
    [CodeService.STO]: 'Sistema de web storage',
    [CodeService.SUP]: 'Sistema de soporte',
  };
  return serviceMap[codeService];
};

export const buildUserRegistrationEmail = (params: {
  fullName: string;
  username: string;
  password: string;
  role: Role;
  codeService: CodeService;
  companyName: string;
  logoUrl: string;
  primaryColor: string;
}): string => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const roleDisplayName = getRoleDisplayName(params.role);
  const serviceDisplayName = getServiceDisplayName(params.codeService);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">¡Bienvenido a ${params.companyName}!</h1>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.fullName}</strong>,</p>
      <p>Tu cuenta ha sido creada exitosamente en <strong>${params.companyName}</strong> para el <strong>${serviceDisplayName}</strong>${roleDisplayName ? `, con el rol de <strong>${roleDisplayName}</strong>` : ''}. A continuación encontrarás tus credenciales de acceso.</p>

      <!-- Credenciales de Acceso -->
      <div style="
        margin: 25px 0;
        padding: 20px;
        border-left: 4px solid #28a745;
        background: #d4edda;
        border-radius: 0 6px 6px 0;
      ">
        <h2 style="margin: 0 0 15px 0; color: #155724; font-size: 18px;">🔐 Tus Credenciales de Acceso</h2>

        <div style="background: #ffffff; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Nombre de Usuario</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333; word-break: break-all;">${params.username}</p>
        </div>

        <div style="background: #ffffff; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Contraseña Temporal</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333; font-family: 'Courier New', monospace; word-break: break-all;">${params.password}</p>
        </div>

        <div style="background: #ffffff; border-radius: 6px; padding: 15px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Fecha de creación</p>
          <p style="margin: 0; font-size: 14px; color: #333;">${formattedDate}</p>
        </div>
      </div>

      <!-- Instrucciones de primer acceso -->
      <div style="
        margin: 20px 0;
        padding: 15px;
        background: #d1ecf1;
        border-left: 4px solid #17a2b8;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 10px 0; color: #0c5460; font-size: 16px;">📝 Instrucciones de Primer Acceso</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0c5460;">
          <li style="margin: 5px 0;">Utiliza las credenciales proporcionadas para iniciar sesión</li>
          <li style="margin: 5px 0;">Se recomienda cambiar tu contraseña en el primer acceso</li>
          <li style="margin: 5px 0;">Mantén tus credenciales seguras y no las compartas</li>
          <li style="margin: 5px 0;">Si tienes problemas para acceder, contacta con soporte</li>
        </ul>
      </div>

      <!-- Aviso de seguridad -->
      <div style="
        padding: 12px;
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        border-radius: 0 4px 4px 0;
        margin: 20px 0;
      ">
        <p style="margin: 0; font-size: 13px; color: #856404;">
          <strong>⚠️ Importante:</strong> Esta contraseña es temporal y se tendrá que cambiar en tu primer inicio de sesión. Si no solicitaste esta cuenta, contacta inmediatamente con soporte.
        </p>
      </div>

      <!-- Pie -->
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
        <p style="margin: 5px 0;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${params.companyName}</p>
      </div>
    </div>
  `;
};

import { CodeService } from '../../dto/send-user-update-email.dto';

const getServiceDisplayName = (codeService: CodeService): string => {
  const serviceMap: Record<CodeService, string> = {
    [CodeService.VDI]: 'sistema de reservas de laboratorios virtuales (VDI)',
    [CodeService.STO]: 'sistema de web storage (STO)',
    [CodeService.SUP]: 'sistema de soporte (SUP)',
  };
  return serviceMap[codeService];
};

export const buildUserUpdateEmail = (params: {
  fullName: string;
  username: string;
  password: string;
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

  const serviceDisplayName = getServiceDisplayName(params.codeService);
  const passwordWasUpdated = params.password !== 'No se actualizó';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">Actualización de Cuenta en ${params.companyName}</h1>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.fullName}</strong>,</p>
      <p>Tu cuenta ha sido actualizada por un administrador en <strong>${params.companyName}</strong> desde el <strong>${serviceDisplayName}</strong>. A continuación encontrarás la información actualizada de tu cuenta.</p>

      <!-- Información de Cuenta Actualizada -->
      <div style="
        margin: 25px 0;
        padding: 20px;
        border-left: 4px solid #28a745;
        background: #d4edda;
        border-radius: 0 6px 6px 0;
      ">
        <h2 style="margin: 0 0 15px 0; color: #155724; font-size: 18px;">${passwordWasUpdated ? '🔐 Tus Credenciales Actualizadas' : '📋 Información de tu Cuenta Actualizada'}</h2>

        <div style="background: #ffffff; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Nombre de Usuario</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333; word-break: break-all;">${params.username}</p>
        </div>

        ${
          passwordWasUpdated
            ? `
        <div style="background: #ffffff; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Contraseña Temporal</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333; font-family: 'Courier New', monospace; word-break: break-all;">${params.password}</p>
        </div>
        `
            : ''
        }

        <div style="background: #ffffff; border-radius: 6px; padding: 15px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Fecha de actualización</p>
          <p style="margin: 0; font-size: 14px; color: #333;">${formattedDate}</p>
        </div>
      </div>

      <!-- Instrucciones importantes -->
      <div style="
        margin: 20px 0;
        padding: 15px;
        background: #d1ecf1;
        border-left: 4px solid #17a2b8;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 10px 0; color: #0c5460; font-size: 16px;">📝 Información Importante</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0c5460;">
          ${
            passwordWasUpdated
              ? `
          <li style="margin: 5px 0;">Utiliza las credenciales actualizadas para iniciar sesión</li>
          <li style="margin: 5px 0;">Se recomienda cambiar tu contraseña en el primer acceso</li>
          <li style="margin: 5px 0;">Mantén tus credenciales seguras y no las compartas</li>
          `
              : `
          <li style="margin: 5px 0;">Tu contraseña actual sigue siendo la misma</li>
          <li style="margin: 5px 0;">Se han actualizado otros datos de tu cuenta</li>
          <li style="margin: 5px 0;">Mantén tus credenciales seguras y no las compartas</li>
          `
          }
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
          <strong>⚠️ Importante:</strong> ${
            passwordWasUpdated
              ? 'Esta contraseña es temporal y se tendrá que cambiar en tu primer inicio de sesión.'
              : ''
          } Si no solicitaste esta actualización, contacta inmediatamente con soporte.
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

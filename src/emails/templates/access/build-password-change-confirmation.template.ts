export const buildPasswordChangeConfirmationEmail = (params: {
  fullName: string;
  username: string;
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

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">Contraseña Actualizada</h1>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.fullName}</strong>,</p>
      <p>Te confirmamos que tu contraseña ha sido cambiada exitosamente en <strong>${params.companyName}</strong>.</p>

      <!-- Información del cambio -->
      <div style="
        margin: 25px 0;
        padding: 20px;
        border-left: 4px solid ${params.primaryColor};
        background: #f8f9fa;
        border-radius: 0 6px 6px 0;
      ">
        <h2 style="margin: 0 0 15px 0; color: ${params.primaryColor}; font-size: 18px;">✅ Cambio Confirmado</h2>
        <div style="background: #ffffff; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Usuario</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${params.username}</p>
        </div>
        <div style="background: #ffffff; border-radius: 6px; padding: 15px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Fecha y hora del cambio</p>
          <p style="margin: 0; font-size: 14px; color: #333;">${formattedDate}</p>
        </div>
      </div>

      <!-- Información de seguridad -->
      <div style="
        margin: 20px 0;
        padding: 15px;
        background: #d4edda;
        border-left: 4px solid #28a745;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 10px 0; color: #155724; font-size: 16px;">🔐 Tu Cuenta está Segura</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #155724;">
          <li style="margin: 5px 0;">Tu nueva contraseña está activa</li>
          <li style="margin: 5px 0;">Puedes iniciar sesión con ella inmediatamente</li>
          <li style="margin: 5px 0;">Asegúrate de recordarla o guardarla en un lugar seguro</li>
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
          <strong>⚠️ Aviso de Seguridad:</strong> Si no realizaste este cambio, contacta inmediatamente con soporte para proteger tu cuenta.
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

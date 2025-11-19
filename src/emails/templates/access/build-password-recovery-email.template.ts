export const buildPasswordRecoveryEmail = (params: {
  fullName: string;
  username: string;
  pin: string;
  companyName: string;
  logoUrl: string;
  primaryColor: string;
}): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">Recuperación de Contraseña</h1>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.fullName}</strong>,</p>
      <p>Hemos recibido una solicitud para recuperar la contraseña de tu cuenta en <strong>${params.companyName}</strong>.</p>

      <!-- PIN de Recuperación -->
      <div style="
        margin: 25px 0;
        padding: 20px;
        border-left: 4px solid ${params.primaryColor};
        background: #f8f9fa;
        border-radius: 0 6px 6px 0;
        text-align: center;
      ">
        <h2 style="margin: 0 0 10px 0; color: ${params.primaryColor}; font-size: 18px;">Tu PIN de Recuperación</h2>
        <div style="
          display: inline-block;
          background: #ffffff;
          border: 2px solid ${params.primaryColor};
          border-radius: 8px;
          padding: 15px 30px;
          margin: 10px 0;
        ">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">PIN</p>
          <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${params.primaryColor}; letter-spacing: 4px;">${params.pin}</p>
        </div>
        <div style="margin-top: 15px; padding: 10px; background: #ffffff; border-radius: 6px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">Usuario</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${params.username}</p>
        </div>
      </div>

      <!-- Instrucciones -->
      <div style="
        margin: 20px 0;
        padding: 15px;
        background: #e7f3ff;
        border-left: 4px solid #2196F3;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 10px 0; color: #2196F3; font-size: 16px;">📌 Instrucciones</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;">
          <li style="margin: 5px 0;">Ingresa este PIN en la pantalla de recuperación de contraseña</li>
          <li style="margin: 5px 0;">El PIN es válido por tiempo limitado</li>
          <li style="margin: 5px 0;">Luego podrás establecer una nueva contraseña</li>
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
          <strong>⚠️ Aviso de Seguridad:</strong> Si no solicitaste esta recuperación de contraseña, ignora este correo y tu cuenta permanecerá segura.
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

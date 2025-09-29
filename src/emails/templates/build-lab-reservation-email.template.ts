export const buildLabReservationEmail = (params: {
  companyName: string;
  logoUrl: string;
  userName: string;
  reservationDate: string;
  details: Array<{
    labDescription: string;
    equipmentDescription: string;
    startTime: string;
    endTime: string;
    date: string;
    metadata: Record<string, any>;
  }>;
  primaryColor: string;
}): string => {
  const detailsHtml = params.details
    .map((detail) => {
      const { username, password, accessUrl } = detail.metadata;

      return `
      <div style="
        margin-bottom: 12px;
        padding: 10px;
        border-left: 4px solid ${params.primaryColor};
        background: #f8f9fa;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 8px 0; color: ${params.primaryColor}; font-size: 16px;">${detail.labDescription}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
          <p style="margin: 0; font-size: 14px;"><strong>Equipo:</strong> ${detail.equipmentDescription}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Fecha:</strong> ${detail.date}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Horario:</strong> ${detail.startTime} - ${detail.endTime}</p>
        </div>

        <!-- Credenciales de acceso -->
        <div style="
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 8px;
          margin-top: 8px;
        ">
          <h4 style="margin: 0 0 6px 0; color: ${params.primaryColor}; font-size: 14px;">Credenciales de Acceso</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 13px;">
            <p style="margin: 0;"><strong>Usuario:</strong> ${username || 'N/A'}</p>
            <p style="margin: 0;"><strong>Contraseña:</strong> ${password || 'N/A'}</p>
          </div>
          ${
            accessUrl
              ? `
            <p style="margin: 6px 0 0 0; font-size: 13px;">
              <strong>URL de Acceso:</strong>
              <a href="${accessUrl}" style="color: ${params.primaryColor}; text-decoration: none;" target="_blank">${accessUrl}</a>
            </p>
          `
              : ''
          }
        </div>
      </div>
    `;
    })
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">Confirmación de Reserva</h1>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.userName}</strong>,</p>
      <p>Tu reserva en <strong>${params.companyName}</strong> realizada el día <strong>${params.reservationDate}</strong> ha sido confirmada:</p>

      <!-- Todas las reservas -->
      ${detailsHtml}

      <!-- Pie -->
      <div style="margin-top: 25px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
        <p>© ${new Date().getFullYear()} ${params.companyName}</p>
      </div>
    </div>
  `;
};

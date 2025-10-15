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
    reservationLaboratoryEquipmentId: string;
    metadata: Record<string, any>;
  }>;
  primaryColor: string;
  appDomain: string;
}): string => {
  const detailsHtml = params.details
    .map((detail) => {
      const { username, password, accessUrl } = detail.metadata;
      const reservationDetailUrl = `${params.appDomain}/reservation-detail/${detail.reservationLaboratoryEquipmentId}`;
      // Estilos para los botones
      const ingresarButtonHtml = accessUrl
        ? `
        <a href="${accessUrl}" target="_blank" style="
          display: inline-block;
          padding: 6px 16px; /* Padding correcto */
          background-color: ${params.primaryColor};
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: bold;
          white-space: nowrap;
          mso-padding-alt: 0;
        ">
          Ingresar
          </a>
      `
        : '';
      const verDetallesLinkHtml = `
        <a href="${reservationDetailUrl}" target="_blank" style="
          display: inline-block;
          padding: 4px 14px;
          font-size: 13px;
          color: ${params.primaryColor};
          text-decoration: none;
          font-weight: 500;
          white-space: nowrap;
          border: 2px solid ${params.primaryColor};
          border-radius: 4px;
          margin-right: 4px;
          box-sizing: border-box;
        ">
          Ver detalles
        </a>
      `;

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

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        ">
          <tr>
            <td style="padding: 8px 10px 4px 10px;">
              <h4 style="margin: 0; color: ${params.primaryColor}; font-size: 14px;">Credenciales de Acceso</h4>
            </td>
          </tr>
          <tr>
             <td style="padding: 0 10px; font-size: 13px; line-height: 1.5;">
              <p style="margin: 0;"><strong>Usuario:</strong> ${username || 'N/A'}</p>
              <p style="margin: 0;"><strong>Contraseña:</strong> ${password || 'N/A'}</p>
            </td>
          </tr>
          ${
            accessUrl
              ? `
            <tr>
              <td style="padding: 4px 10px 8px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="
                      width: 65%;
                      font-size: 13px;
                      line-height: 1.5;
                      padding: 0;
                      vertical-align: middle;
                      mso-table-rspace: 0;
                    ">
                      <p style="margin: 0;">
                        <strong>URL:</strong>
                        <a href="${accessUrl}" style="color: ${params.primaryColor}; text-decoration: none;" target="_blank">${accessUrl}</a>
                      </p>
                    </td>

                    <td style="
                      width: 35%;
                      text-align: right;
                      padding: 0;
                      vertical-align: middle;
                      white-space: nowrap;
                      mso-table-lspace: 0;
                      mso-table-rspace: 0;
                    ">
                      ${verDetallesLinkHtml}
                      ${ingresarButtonHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            `
              : `
              <tr>
                <td style="padding: 4px 10px 8px 10px; text-align: right;">
                  ${verDetallesLinkHtml}
                </td>
              </tr>
            `
          }
        </table>
      </div>
    `;
    })
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">Confirmación de Reserva</h1>
      </div>

      <p>Hola <strong>${params.userName}</strong>,</p>
      <p>Tu reserva en <strong>${params.companyName}</strong> realizada el día <strong>${params.reservationDate}</strong> ha sido confirmada:</p>

      ${detailsHtml}

      <div style="margin-top: 25px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
        <p>© ${new Date().getFullYear()} ${params.companyName}</p>
      </div>
    </div>
  `;
};

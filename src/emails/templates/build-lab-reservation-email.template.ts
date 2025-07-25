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
  }>;
  primaryColor: string;
}): string => {
  const firstDetail = params.details[0];
  const remainingCount = params.details.length - 1;

  const detailHtml = `
    <div style="
      position: relative;
      margin-bottom: 15px;
      padding: 12px;
      border-left: 4px solid ${params.primaryColor};
      background: #f8f9fa;
    ">
      <h3 style="margin: 0 0 5px 0; color: ${params.primaryColor};">${firstDetail.labDescription}</h3>
      <p><strong>Equipo:</strong> ${firstDetail.equipmentDescription}</p>
      <p><strong>Fecha:</strong> ${firstDetail.date}</p>
      <p><strong>Horario:</strong> ${firstDetail.startTime} - ${firstDetail.endTime}</p>
      
      ${
        remainingCount > 0
          ? `<span style="
              position: absolute;
              bottom: 8px;
              right: 12px;
              background: ${params.primaryColor};
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
            ">+${remainingCount}</span>`
          : ''
      }
    </div>
  `;

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

      <!-- Detalle principal con contador -->
      ${detailHtml}

      <!-- Pie -->
      <div style="margin-top: 25px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
        <p>© ${new Date().getFullYear()} ${params.companyName}</p>
      </div>
    </div>
  `;
};

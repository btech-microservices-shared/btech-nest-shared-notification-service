export const buildLabEquipmentReservationCancellationEmail = (params: {
  logoUrl: string;
  companyName: string;
  subscriberName: string;
  laboratoryName: string;
  reservationDate: string;
  initialHour: string;
  finalHour: string;
  primaryColor: string;
  username: string;
  password: string;
  accessUrl: string;
}): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">Cancelación de Reserva de Laboratorio</h1>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.subscriberName}</strong>,</p>
      <p>Tu solicitud de cancelación de reserva de equipo en <strong>${params.companyName}</strong> ha sido <strong>completada</strong>.</p>

      <!-- Detalles de la reserva cancelada -->
      <div style="
        margin-bottom: 20px;
        padding: 15px;
        border-left: 4px solid #dc3545;
        background: #f8d7da;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 12px 0; color: #dc3545; font-size: 18px;">Detalles de la Reserva Cancelada</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <p style="margin: 0; font-size: 14px;"><strong>Laboratorio:</strong> ${params.laboratoryName}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Fecha:</strong> ${params.reservationDate}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Horario:</strong> ${params.initialHour} - ${params.finalHour}</p>
        </div>
      </div>

      <!-- Credenciales deshabilitadas -->
      <div style="
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f9fa;
        border: 2px solid #6c757d;
        border-radius: 6px;
      ">
        <h3 style="margin: 0 0 12px 0; color: #6c757d; font-size: 18px;">Credenciales de Acceso (Deshabilitadas)</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; margin-bottom: 10px; opacity: 0.6;">
          <div>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">Usuario</p>
            <p style="margin: 0; font-weight: bold; font-size: 14px; text-decoration: line-through;">${params.username}</p>
          </div>
          <div>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">Contraseña</p>
            <p style="margin: 0; font-weight: bold; font-size: 14px; text-decoration: line-through;">${params.password}</p>
          </div>
        </div>
        <div style="margin-top: 10px; opacity: 0.6;">
          <p style="margin: 0 0 6px 0; color: #666; font-size: 12px;">URL de Acceso</p>
          <p style="margin: 0; font-weight: bold; text-decoration: line-through; word-break: break-all; color: #6c757d;">${params.accessUrl}</p>
        </div>
      </div>

      <!-- Aviso importante -->
      <div style="
        padding: 12px;
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        border-radius: 0 4px 4px 0;
        margin-bottom: 20px;
      ">
        <p style="margin: 0; font-size: 13px; color: #856404;">
          <strong>Nota importante:</strong> Las credenciales de acceso han sido deshabilitadas y ya no podrás acceder al laboratorio con esta reserva.
        </p>
      </div>

      <!-- Pie -->
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
        <p style="margin: 5px 0;">Si tienes alguna pregunta o necesitas realizar una nueva reserva, no dudes en contactarnos.</p>
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${params.companyName}</p>
      </div>
    </div>
  `;
};

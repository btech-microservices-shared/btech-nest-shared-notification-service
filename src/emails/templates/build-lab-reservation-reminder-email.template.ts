export const buildLabReservationReminderEmail = (params: {
  companyName: string;
  logoUrl: string;
  userName: string;
  reminderMinutes: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  labDescription: string;
  equipmentDescription: string;
  primaryColor: string;
}): string => {
  // Función para quitar segundos del formato HH:mm:ss
  const formatTime = (time: string): string => {
    return time.substring(0, 5); // Obtiene solo HH:mm
  };

  const formattedStartTime = formatTime(params.startTime);
  const formattedEndTime = formatTime(params.endTime);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px;">
        <h1 style="color: ${params.primaryColor};">🔔 Recordatorio de Reserva</h1>
      </div>

      <!-- Alerta de proximidad -->
      <div style="
        margin-bottom: 20px;
        padding: 15px;
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        border-radius: 0 6px 6px 0;
        text-align: center;
      ">
        <h2 style="margin: 0 0 10px 0; color: #856404; font-size: 20px;">⏰ Tu reserva comienza a las ${formattedStartTime}</h2>
        <p style="margin: 0; font-size: 14px; color: #856404;">Prepárate para acceder a tu laboratorio</p>
      </div>

      <!-- Saludo -->
      <p>Hola <strong>${params.userName}</strong>,</p>
      <p>Te recordamos que tu reserva está próxima a comenzar:</p>

      <!-- Detalles de la reserva -->
      <div style="
        margin-bottom: 20px;
        padding: 15px;
        border-left: 4px solid ${params.primaryColor};
        background: #f8f9fa;
        border-radius: 0 6px 6px 0;
      ">
        <h3 style="margin: 0 0 12px 0; color: ${params.primaryColor}; font-size: 18px;">📋 Detalles de la Reserva</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <p style="margin: 0; font-size: 14px;"><strong>Laboratorio:</strong> ${params.labDescription}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Equipo:</strong> ${params.equipmentDescription}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Fecha:</strong> ${params.reservationDate}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Horario:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
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
          <li style="margin: 5px 0;">Asegúrate de tener tus credenciales de acceso a la mano</li>
          <li style="margin: 5px 0;">Verifica tu conexión a internet antes de comenzar</li>
          <li style="margin: 5px 0;">Ten en cuenta que el acceso estará disponible solo durante el horario reservado</li>
        </ul>
      </div>

      <!-- Nota importante -->
      <div style="
        padding: 12px;
        background: #d4edda;
        border-left: 4px solid #28a745;
        border-radius: 0 4px 4px 0;
        margin-bottom: 20px;
      ">
        <p style="margin: 0; font-size: 13px; color: #155724;">
          <strong>💡 Tip:</strong> Si necesitas las credenciales de acceso, revisa el correo de confirmación de tu reserva.
        </p>
      </div>

      <!-- Pie -->
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
        <p style="margin: 5px 0;">¡Que tengas una excelente sesión de laboratorio!</p>
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${params.companyName}</p>
      </div>
    </div>
  `;
};

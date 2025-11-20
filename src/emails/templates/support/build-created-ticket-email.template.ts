export const buildCreatedTicketEmail = (params: {
  companyName: string;
  logoUrl: string;
  userName: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  type: string;
  category: string;
  createdDate: string;
  primaryColor: string;
  source?: string;
  tags?: string[];
  ccEmails?: string[];
  productName?: string;
  serialNumber?: string;
}): string => {
  const getPriorityColor = (priority: string): string => {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return '#dc3545';
      case 'HIGH':
        return '#ff6b6b';
      case 'MEDIUM':
        return '#fd7e14';
      case 'LOW':
        return '#28a745';
      default:
        return params.primaryColor;
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'Urgente';
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Media';
      case 'LOW':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getTypeText = (type: string): string => {
    switch (type.toUpperCase()) {
      case 'INCIDENT':
        return 'Incidente';
      case 'REQUEST':
        return 'Solicitud';
      case 'QUESTION':
        return 'Pregunta';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return '#0dcaf0';
      case 'OPEN':
        return '#28a745';
      case 'PENDING':
        return '#17a2b8';
      case 'ASSIGNED':
        return '#6f42c1';
      case 'IN_PROGRESS':
        return '#ffc107';
      case 'SOLVED':
        return '#198754';
      case 'CLOSED':
        return '#6c757d';
      case 'IN_COLLABORATION':
        return '#e83e8c';
      default:
        return params.primaryColor;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'Nuevo';
      case 'OPEN':
        return 'Abierto';
      case 'PENDING':
        return 'Pendiente';
      case 'ASSIGNED':
        return 'Asignado';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'SOLVED':
        return 'Resuelto';
      case 'CLOSED':
        return 'Cerrado';
      case 'IN_COLLABORATION':
        return 'En Colaboración';
      default:
        return status;
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0;">
    <div style="font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, ${params.primaryColor} 0%, ${params.primaryColor}dd 100%);">
        <img src="${params.logoUrl}" alt="${params.companyName}" style="max-width: 200px; margin-bottom: 10px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Nuevo Ticket de Soporte</h1>
      </div>

      <div style="padding: 0 20px;">
        <!-- Saludo -->
        <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>${params.userName}</strong>,</p>
        <p style="margin-bottom: 20px;">Hemos recibido tu solicitud de soporte y hemos creado el siguiente ticket:</p>

        <!-- Información del ticket -->
        <div style="
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: ${params.primaryColor}; font-size: 20px;">Ticket ${params.ticketNumber}</h2>
            <div style="display: flex; gap: 10px;">
              <span style="
                background: ${getPriorityColor(params.priority)};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
              ">${getPriorityText(params.priority).toUpperCase()}</span>
              <span style="
                background: ${getStatusColor(params.status)};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
              ">${getStatusText(params.status).toUpperCase()}</span>
            </div>
          </div>

          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">${params.title}</h3>

          <div style="margin-bottom: 15px;">
            <strong>Descripción:</strong>
            <div style="margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid ${params.primaryColor};">
              ${params.description}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; color: #6c757d;">
            <div><strong>Tipo:</strong> ${getTypeText(params.type)}</div>
            <div><strong>Categoría:</strong> ${params.category}</div>
            <div><strong>Creado:</strong> ${params.createdDate}</div>
            ${params.source ? `<div><strong>Fuente:</strong> ${params.source}</div>` : ''}
            ${params.productName ? `<div><strong>Producto:</strong> ${params.productName}</div>` : ''}
            ${params.serialNumber ? `<div><strong>Número de Serie:</strong> ${params.serialNumber}</div>` : ''}
          </div>

          ${
            params.tags && params.tags.length > 0
              ? `
          <div style="margin-top: 15px;">
            <strong>Etiquetas:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
              ${params.tags
                .map(
                  (tag) => `
                <span style="
                  background: ${params.primaryColor}20;
                  color: ${params.primaryColor};
                  padding: 3px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  border: 1px solid ${params.primaryColor}40;
                ">${tag}</span>
              `,
                )
                .join('')}
            </div>
          </div>
          `
              : ''
          }

          ${
            params.ccEmails && params.ccEmails.length > 0
              ? `
          <div style="margin-top: 15px; font-size: 14px;">
            <strong>CC:</strong> ${params.ccEmails.join(', ')}
          </div>
          `
              : ''
          }
        </div>

        <!-- Call to Action -->
        <div style="
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
          color: white;
        ">
          <p style="margin: 0; font-weight: bold;">¡Gracias por contactarnos!</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Nuestro equipo revisará tu solicitud y te responderemos pronto.</p>
        </div>

        <!-- Pie -->
        <div style="
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          font-size: 12px;
          color: #6c757d;
          text-align: center;
        ">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${params.companyName}</p>
          <p style="margin: 5px 0 0 0;">Sistema de Soporte Técnico</p>
        </div>
      </div>
    </div>
    </body>
    </html>
  `;
};

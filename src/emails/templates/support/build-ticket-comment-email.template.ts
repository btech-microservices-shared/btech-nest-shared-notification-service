export const buildTicketCommentEmail = (params: {
  companyName: string;
  logoUrl: string;
  userName: string;
  ticketNumber: string;
  ticketTitle: string;
  commentAuthor: string;
  commentContent: string;
  commentDate: string;
  primaryColor: string;
  ticketUrl: string;
  ticketStatus?: string;
}): string => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0;">
    <div style="font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #ffffff; color: #24292f;">
      <!-- Contenido principal -->
      <div style="padding: 0 20px 20px 20px;">
        <!-- Comentario con avatar -->
        <div style="margin-bottom: 24px;">
          <!-- Header del comentario -->
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 16px;">
            <tr>
              <td style="width: 40px; vertical-align: top; padding-right: 16px;">
                <!-- Avatar circular -->
                <div style="
                  background: ${params.primaryColor};
                  color: white;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 40px;
                  font-weight: bold;
                  font-size: 16px;
                ">
                  ${params.commentAuthor.charAt(0).toUpperCase()}
                </div>
              </td>
              <td style="vertical-align: top;">
                <!-- Info del autor -->
                <div style="font-size: 15px; font-weight: 500; color: #24292f; margin-bottom: 4px;">
                  ${params.commentAuthor} <span style="font-weight: normal; color: #57606a;">(${params.ticketNumber})</span>
                </div>
                <div style="font-size: 13px; color: #57606a;">
                  ${formatDate(params.commentDate)}
                </div>
              </td>
            </tr>
          </table>

          <!-- Contenido del comentario -->
          <div style="
            background: rgba(246, 248, 250, 0.6);
            border: 1px solid #d0d7de;
            border-radius: 6px;
            padding: 20px;
          ">
            <div style="
              color: #24292f;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-wrap: break-word;
            ">${params.commentContent}</div>
          </div>
        </div>
      </div>

      <!-- Pie de página minimalista -->
      <div style="
        padding: 20px;
        margin-top: 30px;
        border-top: 1px solid #d0d7de;
      ">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom: 12px;">
              <img src="${params.logoUrl}" alt="${params.companyName}" style="height: 24px; display: block;">
            </td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #57606a; line-height: 1.5;">
              <span style="color: #24292f; font-weight: 500;">TICKET: ${params.ticketTitle.toUpperCase()}</span><br>
              ${params.ticketNumber}
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;">
              <a href="${params.ticketUrl}" style="
                display: inline-block;
                font-size: 13px;
                color: ${params.primaryColor};
                text-decoration: none;
                font-weight: 500;
              ">Ver en ${params.companyName} →</a>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 16px; font-size: 13px; color: #8c959f;">
              © ${new Date().getFullYear()} ${params.companyName}
            </td>
          </tr>
        </table>
      </div>
    </div>
    </body>
    </html>
  `;
};

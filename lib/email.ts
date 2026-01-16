/**
 * Email Service für DanceMotion - Kontaktformular
 * Nur SMTP/Nodemailer - Keine externen Services nötig
 * DSGVO-konform: Keine Speicherung, nur Versand
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  pageSource?: string; // z.B. "/formulare", "/eventstudio"
}

/**
 * Generiert HTML für Contact-Form Email
 */
export function generateContactEmailHTML(data: ContactFormData): string {
  const timestamp = new Date().toLocaleString('de-DE');
  
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #2ec4c6 0%, #00d4d4 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2ec4c6; margin-bottom: 5px; }
        .value { padding: 10px; background: #f5f5f5; border-left: 3px solid #2ec4c6; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎭 Neue Kontaktanfrage - DanceMotion</h1>
        </div>
        <div class="content">
          <p>Es ist eine neue Kontaktanfrage eingegangen:</p>
          
          <div class="field">
            <div class="label">👤 Name</div>
            <div class="value">${escapeHtml(data.name)}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 E-Mail</div>
            <div class="value">
              <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
            </div>
          </div>
          
          ${data.phone ? `
          <div class="field">
            <div class="label">📱 Telefon</div>
            <div class="value">
              <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>
            </div>
          </div>
          ` : ''}
          
          ${data.subject ? `
          <div class="field">
            <div class="label">📌 Betreff</div>
            <div class="value">${escapeHtml(data.subject)}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">💬 Nachricht</div>
            <div class="value" style="white-space: pre-wrap;">${escapeHtml(data.message)}</div>
          </div>
          
          ${data.pageSource ? `
          <div class="field">
            <div class="label">📍 Quelle</div>
            <div class="value">${escapeHtml(data.pageSource)}</div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>⏰ Eingegangen am: ${timestamp}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generiert Text-Version für Email
 */
export function generateContactEmailText(data: ContactFormData): string {
  const timestamp = new Date().toLocaleString('de-DE');
  
  return `
NEUE KONTAKTANFRAGE - DanceMotion

Name: ${data.name}
E-Mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}\n` : ''}${data.subject ? `Betreff: ${data.subject}\n` : ''}
Nachricht:
${data.message}

${data.pageSource ? `Quelle: ${data.pageSource}\n` : ''}Eingegangen am: ${timestamp}
  `.trim();
}

/**
 * Sendet Email via SMTP (Nodemailer)
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const nodemailer = require('nodemailer');

    // SMTP Konfiguration aus ENV
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    });

    const result = await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || 'noreply@dancemotion.org',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * HTML-Escape für Sicherheit
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}


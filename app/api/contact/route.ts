/**
 * API Endpoint für Kontaktformular
 * POST /api/contact
 * 
 * Nimmt Kontaktanfragen entgegen und sendet sie via Email
 * DSGVO-konform: Keine Datenspeicherung in DB!
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateContactEmailHTML, generateContactEmailText, type ContactFormData } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { validateEmail, sanitizeInput } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    // ========================================
    // RATE LIMITING
    // ========================================
    const clientIp = getClientIp(request);
    const rateLimitResponse = checkRateLimit(
      request,
      `contact-form-${clientIp}`,
      5, // 5 requests
      60 * 60 * 1000 // per hour
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    
    const { name, email, phone, subject, message, pageSource } = body;

    // ========================================
    // VALIDIERUNG
    // ========================================
    
    // Pflichtfelder
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Nachricht sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Input-Längen-Limits
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name darf maximal 100 Zeichen lang sein' },
        { status: 400 }
      );
    }
    
    if (email.length > 255) {
      return NextResponse.json(
        { error: 'E-Mail darf maximal 255 Zeichen lang sein' },
        { status: 400 }
      );
    }

    if (phone && phone.length > 30) {
      return NextResponse.json(
        { error: 'Telefonnummer darf maximal 30 Zeichen lang sein' },
        { status: 400 }
      );
    }
    
    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Nachricht darf maximal 5000 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Email-Validierung mit verbesserter Funktion
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // XSS-Schutz: Nur Whitelist-Zeichen erlauben
    const sanitizeInput = (input: string): string => {
      return input
        .trim()
        .replace(/[<>]/g, '') // HTML-Tags entfernen
        .slice(0, 5000); // Max-Länge erzwingen
    };

    const sanitizedData: ContactFormData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : undefined,
      subject: subject ? sanitizeInput(subject) : undefined,
      message: sanitizeInput(message),
      pageSource: pageSource ? sanitizeInput(pageSource) : undefined,
    };

    // ========================================
    // EMAIL VERSENDEN
    // ========================================

    const adminEmail = process.env.CONTACT_EMAIL || 'kontakt@dancemotion.de'; // TODO: Placeholder - wird noch gesetzt

    const emailResult = await sendEmail({
      to: adminEmail,
      subject: `📝 Neue Kontaktanfrage${sanitizedData.subject ? ': ' + sanitizedData.subject : ''}`,
      html: generateContactEmailHTML(sanitizedData),
      text: generateContactEmailText(sanitizedData),
      replyTo: sanitizedData.email,
    });

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: 'Email konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
        { status: 500 }
      );
    }

    // ========================================
    // SUCCESS
    // ========================================

    return NextResponse.json(
      {
        success: true,
        message: 'Ihre Nachricht wurde erfolgreich versendet!',
        messageId: emailResult.messageId,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}

// CORS Header erlauben (für Frontend-Requests)
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

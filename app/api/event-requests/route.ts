import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// NOTE: GET wurde entfernt - Admin-Zugriff auf Event-Anfragen nur über /api/admin/event-requests

// POST - Neue Event-Anfrage erstellen (öffentlich)
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer;
    const body = await request.json();

    const { name, email, phone, event_type, event_date, guest_count, message } = body;

    // ========================================
    // VALIDIERUNG & SANITIZATION
    // ========================================
    
    // Pflichtfelder
    if (!name || !email || !event_type) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Event-Art sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Input-Längen-Limits (DSGVO: Datensparsamkeit)
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
    
    if (message && message.length > 2000) {
      return NextResponse.json(
        { error: 'Nachricht darf maximal 2000 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Email-Validierung (strenger)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }
    
    // Event-Type Whitelist (SQL Injection Schutz)
    const allowedEventTypes = ['wedding', 'corporate', 'birthday', 'show', 'workshop', 'other'];
    if (!allowedEventTypes.includes(event_type)) {
      return NextResponse.json(
        { error: 'Ungültiger Event-Typ' },
        { status: 400 }
      );
    }
    
    // Datum-Validierung (nur zukünftige Daten)
    if (event_date) {
      const selectedDate = new Date(event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return NextResponse.json(
          { error: 'Event-Datum muss in der Zukunft liegen' },
          { status: 400 }
        );
      }
    }
    
    // Gästezahl: Positive Integer
    if (guest_count !== null && guest_count !== undefined) {
      const guestCountNum = parseInt(guest_count);
      if (isNaN(guestCountNum) || guestCountNum < 1 || guestCountNum > 10000) {
        return NextResponse.json(
          { error: 'Gästeanzahl muss zwischen 1 und 10000 liegen' },
          { status: 400 }
        );
      }
    }

    // ========================================
    // SUPABASE INSERT (automatisch SQL-sicher!)
    // ========================================
    // Supabase verwendet Prepared Statements/Parameterized Queries
    // -> Automatischer Schutz vor SQL Injection!

    // Event-Anfrage speichern
    const { data: request_data, error } = await supabase
      .from('event_requests')
      .insert({
        name,
        email,
        phone: phone || null,
        event_type,
        event_date: event_date || null,
        guest_count: guest_count || null,
        message: message || null,
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(request_data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create event request' },
      { status: 500 }
    );
  }
}

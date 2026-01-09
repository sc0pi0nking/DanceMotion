import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle Event-Anfragen abrufen (nur für Admins/Event-Manager)
export async function GET() {
  try {
    const supabase = supabaseServer;
    
    const { data: requests, error } = await supabase
      .from('event_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(requests || []);
  } catch (error: any) {
    console.error('Error fetching event requests:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch event requests' },
      { status: 500 }
    );
  }
}

// POST - Neue Event-Anfrage erstellen (öffentlich)
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer;
    const body = await request.json();

    const { name, email, phone, event_type, event_date, guest_count, message } = body;

    // Validierung
    if (!name || !email || !event_type) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Event-Art sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Email-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

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

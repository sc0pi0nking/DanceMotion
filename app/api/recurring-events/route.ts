import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';

export interface RecurringEvent {
  id: string;
  title: string;
  time: string | null;
  location: string;
  city: string;
  category: 'Auftritt' | 'Workshop' | 'Training' | 'Event';
  groups: string[];
  note: string | null;
  href: string | null;
  recurrence_type: 'weekly' | 'biweekly' | 'monthly';
  day_of_week: number | null;
  day_of_month: number | null;
  start_date: string;
  end_date: string | null;
  excluded_dates: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

// GET - fetch all recurring events (admin only)
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { data, error } = await supabaseServer
      .from('recurring_events')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      if (error.message.includes("does not exist")) {
        return NextResponse.json({ success: true, data: [] });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching recurring events:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Laden der wiederkehrenden Termine' },
      { status: 500 }
    );
  }
}

// POST - create new recurring event
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title, time, location, city, category, groups = [],
      note, href, recurrence_type, day_of_week, day_of_month,
      start_date, end_date, is_active = true
    } = body;

    if (!title || !location || !city || !category || !recurrence_type || !start_date) {
      return NextResponse.json(
        { success: false, error: 'Pflichtfelder fehlen (Titel, Ort, Stadt, Kategorie, Wiederholung, Startdatum)' },
        { status: 400 }
      );
    }

    if ((recurrence_type === 'weekly' || recurrence_type === 'biweekly') && day_of_week === undefined) {
      return NextResponse.json(
        { success: false, error: 'Für wöchentliche Termine muss ein Wochentag angegeben werden' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('recurring_events')
      .insert({
        title, time, location, city, category, groups,
        note, href, recurrence_type, day_of_week, day_of_month,
        start_date, end_date, is_active,
        created_by: session.id,
        updated_by: session.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating recurring event:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Erstellen des wiederkehrenden Termins' },
      { status: 500 }
    );
  }
}

// PUT - update recurring event
export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID ist erforderlich' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('recurring_events')
      .update({ ...updates, updated_by: session.id })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating recurring event:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Aktualisieren des wiederkehrenden Termins' },
      { status: 500 }
    );
  }
}

// DELETE - remove recurring event
export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteFutureEvents = searchParams.get('deleteFutureEvents') === 'true';

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID ist erforderlich' }, { status: 400 });
    }

    // Optionally delete future generated events
    if (deleteFutureEvents) {
      await supabaseServer
        .from('events')
        .delete()
        .eq('recurring_event_id', id)
        .gte('date', new Date().toISOString().split('T')[0]);
    }

    const { error } = await supabaseServer
      .from('recurring_events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recurring event:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Löschen des wiederkehrenden Termins' },
      { status: 500 }
    );
  }
}

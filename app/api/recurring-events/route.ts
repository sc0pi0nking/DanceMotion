import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
  day_of_week: number | null;  // 0=Sunday, 1=Monday, etc.
  day_of_month: number | null;
  start_date: string;
  end_date: string | null;
  excluded_dates: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Day names for display
export const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

// Verify admin authorization
async function verifyAdmin(authToken: string) {
  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await authClient.auth.getUser(authToken);

  if (authError || !user) {
    return { authorized: false, user: null };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
    return { authorized: false, user: null };
  }

  return { authorized: true, user };
}

// GET - fetch all recurring events (admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { authorized } = await verifyAdmin(authToken);
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Keine Admin-Berechtigung' }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('recurring_events')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

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
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { authorized, user } = await verifyAdmin(authToken);
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Keine Admin-Berechtigung' }, { status: 403 });
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

    // Validate recurrence settings
    if ((recurrence_type === 'weekly' || recurrence_type === 'biweekly') && day_of_week === undefined) {
      return NextResponse.json(
        { success: false, error: 'Für wöchentliche Termine muss ein Wochentag angegeben werden' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('recurring_events')
      .insert({
        title, time, location, city, category, groups,
        note, href, recurrence_type, day_of_week, day_of_month,
        start_date, end_date, is_active,
        created_by: user?.id,
        updated_by: user?.id
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
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { authorized, user } = await verifyAdmin(authToken);
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Keine Admin-Berechtigung' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID ist erforderlich' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('recurring_events')
      .update({ ...updates, updated_by: user?.id })
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

// DELETE - remove recurring event (and optionally future generated events)
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { authorized } = await verifyAdmin(authToken);
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Keine Admin-Berechtigung' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteFutureEvents = searchParams.get('deleteFutureEvents') === 'true';

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID ist erforderlich' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Optionally delete future generated events
    if (deleteFutureEvents) {
      await supabase
        .from('events')
        .delete()
        .eq('recurring_event_id', id)
        .gte('date', new Date().toISOString().split('T')[0]);
    }

    // Delete the recurring event template
    const { error } = await supabase
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

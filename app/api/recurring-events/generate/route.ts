import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// POST - Generate events from recurring templates
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    // Verify admin role
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(authToken);

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Nicht autorisiert' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.json({ success: false, error: 'Keine Admin-Berechtigung' }, { status: 403 });
    }

    // Get days ahead from request body (default 90)
    const body = await request.json().catch(() => ({}));
    const daysAhead = body.daysAhead || 90;

    // Call the PostgreSQL function to generate events
    const { data, error } = await supabase.rpc('generate_recurring_events', { days_ahead: daysAhead });

    if (error) {
      // If function doesn't exist yet, do it manually in JS
      console.warn('RPC function not available, generating manually:', error.message);
      
      // Fetch all active recurring events
      const { data: recurringEvents, error: fetchError } = await supabase
        .from('recurring_events')
        .select('*')
        .eq('is_active', true);

      if (fetchError) throw fetchError;

      let eventsCreated = 0;
      const today = new Date();
      const endLimit = new Date(today);
      endLimit.setDate(endLimit.getDate() + daysAhead);

      for (const rec of recurringEvents || []) {
        // Calculate all dates based on recurrence pattern
        let currentDate = new Date(Math.max(new Date(rec.start_date).getTime(), today.getTime()));
        const recEndDate = rec.end_date ? new Date(rec.end_date) : endLimit;
        const actualEndLimit = recEndDate < endLimit ? recEndDate : endLimit;

        // For weekly/biweekly: find next occurrence of the day_of_week
        if ((rec.recurrence_type === 'weekly' || rec.recurrence_type === 'biweekly') && rec.day_of_week !== null) {
          const currentDow = currentDate.getDay();
          const daysUntilNext = (rec.day_of_week - currentDow + 7) % 7;
          currentDate.setDate(currentDate.getDate() + daysUntilNext);
        }

        while (currentDate <= actualEndLimit) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // Skip if in excluded_dates
          if (rec.excluded_dates && rec.excluded_dates.includes(dateStr)) {
            // Advance and continue
          } else {
            // Check if event already exists
            const { data: existing } = await supabase
              .from('events')
              .select('id')
              .eq('recurring_event_id', rec.id)
              .eq('date', dateStr)
              .single();

            if (!existing) {
              // Create the event
              const { error: insertError } = await supabase
                .from('events')
                .insert({
                  title: rec.title,
                  date: dateStr,
                  time: rec.time,
                  location: rec.location,
                  city: rec.city,
                  category: rec.category,
                  groups: rec.groups,
                  note: rec.note,
                  href: rec.href,
                  recurring_event_id: rec.id,
                  is_published: true
                });

              if (!insertError) {
                eventsCreated++;
              }
            }
          }

          // Advance to next occurrence
          if (rec.recurrence_type === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (rec.recurrence_type === 'biweekly') {
            currentDate.setDate(currentDate.getDate() + 14);
          } else if (rec.recurrence_type === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
        }
      }

      return NextResponse.json({ 
        success: true, 
        eventsCreated,
        message: `${eventsCreated} neue Termine wurden generiert.`
      });
    }

    return NextResponse.json({ 
      success: true, 
      eventsCreated: data,
      message: `${data} neue Termine wurden generiert.`
    });
  } catch (error) {
    console.error('Error generating recurring events:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Generieren der Termine' },
      { status: 500 }
    );
  }
}

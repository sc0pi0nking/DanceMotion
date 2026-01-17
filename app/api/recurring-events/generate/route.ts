import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';

// POST - Generate events from recurring templates
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    // Get days ahead from request body (default 90)
    const body = await request.json().catch(() => ({}));
    const daysAhead = body.daysAhead || 90;

    // Try to call the PostgreSQL function first
    const { data, error } = await supabaseServer.rpc('generate_recurring_events', { days_ahead: daysAhead });

    if (error) {
      // If function doesn't exist yet, do it manually in JS
      console.warn('RPC function not available, generating manually:', error.message);
      
      // Fetch all active recurring events
      const { data: recurringEvents, error: fetchError } = await supabaseServer
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
            const { data: existing } = await supabaseServer
              .from('events')
              .select('id')
              .eq('recurring_event_id', rec.id)
              .eq('date', dateStr)
              .single();

            if (!existing) {
              // Create the event
              const { error: insertError } = await supabaseServer
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

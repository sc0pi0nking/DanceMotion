import { supabaseServer } from '@/lib/supabase'
import type { Event } from '@/lib/supabase'

// GET - Fetch all events
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Supabase error:', error);
      // Return empty array if table doesn't exist yet
      if (error.message.includes("Can't find the table")) {
        return Response.json([]);
      }
      throw error;
    }

    return Response.json(data || [])
  } catch (error: any) {
    console.error('GET /api/admin/events error:', error);
    return Response.json(
      { error: error.message, code: error.code },
      { status: 500 }
    )
  }
}

// POST - Create new event
export async function POST(req: Request) {
  try {
    const event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'updated_by'> = await req.json()

    console.log('Creating event:', event);

    const { data, error } = await supabaseServer
      .from('events')
      .insert([event])
      .select()

    if (error) {
      console.error('Supabase POST error:', error);
      
      if (error.message.includes("Can't find the table")) {
        return Response.json(
          { error: 'Database tables not initialized. Please run migrations in Supabase.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('RLS policy')) {
        return Response.json(
          { error: 'Permission denied. Admin authentication required.' },
          { status: 403 }
        );
      }
      
      throw error;
    }

    console.log('Event created:', data[0]);
    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/events error:', error);
    return Response.json(
      { error: error.message || 'Failed to create event', details: error.code },
      { status: 500 }
    )
  }
}

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

    const { data, error } = await supabaseServer
      .from('events')
      .insert([event])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

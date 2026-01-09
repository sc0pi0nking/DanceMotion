import { supabaseServer } from '@/lib/supabase'
import type { Event } from '@/lib/supabase'

// GET - Fetch all events
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
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

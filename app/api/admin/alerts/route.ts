import { supabaseServer } from '@/lib/supabase'

// GET - Fetch all alerts (admin only)
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('system_alerts')
      .select('*')
      .order('end_date', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new alert (admin only)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, message, alert_type, priority, start_date, end_date, is_dismissible, visible_to_admins_only } = body

    // Validate input
    if (!title || !message || !alert_type || !start_date || !end_date) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return Response.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Get current user ID for created_by
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser()
    if (!user || userError) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabaseServer
      .from('system_alerts')
      .insert([{
        title,
        message,
        alert_type,
        priority: priority || 0,
        start_date,
        end_date,
        is_dismissible,
        visible_to_admins_only: visible_to_admins_only || false,
        created_by: user.id,
      }])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('Alert creation failed:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

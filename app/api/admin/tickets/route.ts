import { supabaseServer } from '@/lib/supabase'
import { requirePermission, PERMISSIONS } from '@/lib/auth'

// GET - All tickets (admin only)
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.TICKETS_ADMIN)

    const { data, error } = await supabaseServer
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    if (error?.message?.startsWith?.('Unauthorized')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error?.message?.startsWith?.('Forbidden')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('GET /api/admin/tickets error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create ticket from admin (admin only)
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.TICKETS_ADMIN)

    const body = await req.json()
    const { title, description, category, priority, attachments } = body

    if (!title || !description || !category) {
      return Response.json(
        { error: 'Titel, Beschreibung und Kategorie erforderlich' },
        { status: 400 }
      )
    }

    const validAttachments = Array.isArray(attachments)
      ? attachments.filter((url: string) => typeof url === 'string' && url.startsWith('http')).slice(0, 5)
      : []

    const { data, error } = await supabaseServer
      .from('tickets')
      .insert([{
        title,
        description,
        category,
        priority: priority || 'normal',
        status: 'open',
        admin_notes: [],
        attachments: validAttachments,
      }])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    if (error?.message?.startsWith?.('Unauthorized')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error?.message?.startsWith?.('Forbidden')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('POST /api/admin/tickets error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

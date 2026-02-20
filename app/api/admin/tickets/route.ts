import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// GET - All tickets (admin only)
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.TICKETS_ADMIN)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
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
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.TICKETS_ADMIN)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

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
    console.error('POST /api/admin/tickets error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

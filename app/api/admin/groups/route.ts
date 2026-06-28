import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { CreateGroupSchema, ReorderGroupsSchema } from '@/lib/schemas/groups'

// GET - List all groups (admin: including inactive)
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('groups')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return Response.json(data || [])
  } catch (error: any) {
    console.error('GET /api/admin/groups error:', error)
    return Response.json({ error: 'Gruppen konnten nicht geladen werden' }, { status: 500 })
  }
}

// POST - Create new group
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const parsed = CreateGroupSchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('groups')
      .insert([parsed.data])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return Response.json({ error: 'Slug bereits vergeben' }, { status: 409 })
      }
      throw error
    }

    return Response.json(data, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/groups error:', error)
    return Response.json({ error: 'Gruppe konnte nicht erstellt werden' }, { status: 500 })
  }
}

// PUT - Reorder groups (batch sort_order update)
export async function PUT(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const parsed = ReorderGroupsSchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const updatedAt = new Date().toISOString()
    const results = await Promise.all(
      parsed.data.order.map((item) =>
        supabaseServer
          .from('groups')
          .update({ sort_order: item.sort_order, updated_at: updatedAt })
          .eq('id', item.id)
      )
    )

    const failed = results.find((r) => r.error)
    if (failed?.error) throw failed.error

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('PUT /api/admin/groups error:', error)
    return Response.json({ error: 'Reihenfolge konnte nicht gespeichert werden' }, { status: 500 })
  }
}

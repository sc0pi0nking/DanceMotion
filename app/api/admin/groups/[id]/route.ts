import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { UpdateGroupSchema } from '@/lib/schemas/groups'

// PUT - Update a single group
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const parsed = UpdateGroupSchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('groups')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return Response.json({ error: 'Slug bereits vergeben' }, { status: 409 })
      }
      throw error
    }

    return Response.json(data)
  } catch (error: any) {
    console.error('PUT /api/admin/groups/[id] error:', error)
    return Response.json({ error: 'Gruppe konnte nicht gespeichert werden' }, { status: 500 })
  }
}

// DELETE - Remove a group
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { error } = await supabaseServer.from('groups').delete().eq('id', id)

    if (error) {
      // FK violation (e.g. trial_bookings referencing group slug)
      if (error.code === '23503') {
        return Response.json(
          { error: 'Gruppe wird noch referenziert und kann nicht gelöscht werden. Deaktiviere sie stattdessen.' },
          { status: 409 }
        )
      }
      throw error
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/admin/groups/[id] error:', error)
    return Response.json({ error: 'Gruppe konnte nicht gelöscht werden' }, { status: 500 })
  }
}

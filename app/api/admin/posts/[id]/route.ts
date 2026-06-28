import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { UpdatePostSchema } from '@/lib/schemas/posts'

// PUT - Update a post
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
    const parsed = UpdatePostSchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { published, ...rest } = parsed.data
    const update: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() }

    // Translate publish toggle to published_at, preserving original publish date
    if (published !== undefined) {
      if (published) {
        const { data: existing } = await supabaseServer
          .from('posts')
          .select('published_at')
          .eq('id', id)
          .single()
        update.published_at = existing?.published_at ?? new Date().toISOString()
      } else {
        update.published_at = null
      }
    }

    const { data, error } = await supabaseServer
      .from('posts')
      .update(update)
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
    console.error('PUT /api/admin/posts/[id] error:', error)
    return Response.json({ error: 'Beitrag konnte nicht gespeichert werden' }, { status: 500 })
  }
}

// DELETE - Remove a post
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
    const { error } = await supabaseServer.from('posts').delete().eq('id', id)
    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/admin/posts/[id] error:', error)
    return Response.json({ error: 'Beitrag konnte nicht gelöscht werden' }, { status: 500 })
  }
}

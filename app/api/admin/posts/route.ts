import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { CreatePostSchema } from '@/lib/schemas/posts'

// GET - List all posts (incl. drafts) for admin
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return Response.json(data || [])
  } catch (error: any) {
    console.error('GET /api/admin/posts error:', error)
    return Response.json({ error: 'Beiträge konnten nicht geladen werden' }, { status: 500 })
  }
}

// POST - Create new post
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const parsed = CreatePostSchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { published, ...rest } = parsed.data
    const insert = {
      ...rest,
      published_at: published ? new Date().toISOString() : null,
      created_by: currentUser.id,
    }

    const { data, error } = await supabaseServer
      .from('posts')
      .insert([insert])
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
    console.error('POST /api/admin/posts error:', error)
    return Response.json({ error: 'Beitrag konnte nicht erstellt werden' }, { status: 500 })
  }
}

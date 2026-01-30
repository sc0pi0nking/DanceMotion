import { supabaseServer } from '@/lib/supabase'
import type { ContentItem } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// GET - Fetch all content
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('content')
      .select('*')
      .order('section')

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new content item
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at' | 'updated_by'> = await req.json()

    const { data, error } = await supabaseServer
      .from('content')
      .insert([item])
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

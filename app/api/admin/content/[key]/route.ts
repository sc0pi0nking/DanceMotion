import { supabaseServer } from '@/lib/supabase'
import type { ContentItem } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// GET - Fetch single content item
export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { key } = await params
    const { data, error } = await supabaseServer
      .from('content')
      .select('*')
      .eq('key', key)
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update or create content item (UPSERT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { key } = await params
    const item: Partial<ContentItem> = await req.json()

    // Try to upsert (update if exists, insert if not)
    const { data, error } = await supabaseServer
      .from('content')
      .upsert({
        key: key,
        value: item.value,
        section: item.section || key.split('.')[0],
        description: item.description || `Content for ${key}`,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      console.error('Upsert error:', error)
      throw error
    }

    return Response.json(data[0])
  } catch (error: any) {
    console.error('PUT /api/admin/content/[key] error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove content item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { key } = await params
    const { error } = await supabaseServer
      .from('content')
      .delete()
      .eq('key', key)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

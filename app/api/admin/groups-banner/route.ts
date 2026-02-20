import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'

const GROUPS_BG_KEY = 'groups.banner_image_url'
const GROUPS_BG_SECTION = 'groups'

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol === 'https:') return true

    const isDev = process.env.NODE_ENV !== 'production'
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1'
    return isDev && isLocalhost && url.protocol === 'http:'
  } catch {
    return false
  }
}

export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden - requires content permission' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('content')
      .select('key, value, updated_at')
      .eq('key', GROUPS_BG_KEY)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const imageUrl = data?.value?.text || ''

    return Response.json({
      success: true,
      data: {
        key: GROUPS_BG_KEY,
        image_url: imageUrl,
        updated_at: data?.updated_at || null,
      },
    })
  } catch (error: any) {
    console.error('Groups banner GET error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden - requires content permission' }, { status: 403 })
    }

    const { image_url } = await req.json()
    const nextImageUrl = typeof image_url === 'string' ? image_url.trim() : ''

    if (nextImageUrl && !isValidImageUrl(nextImageUrl)) {
      return Response.json(
        { error: 'Ungültige Bild-URL. Erlaubt sind https:// URLs (http:// nur localhost in Entwicklung).' },
        { status: 400 }
      )
    }

    const payload = {
      key: GROUPS_BG_KEY,
      section: GROUPS_BG_SECTION,
      value: { text: nextImageUrl },
      description: 'Gruppen-Bereich Banner Bild URL',
      updated_by: currentUser.email || 'system',
    }

    const { data: existing } = await supabaseServer
      .from('content')
      .select('id')
      .eq('key', GROUPS_BG_KEY)
      .single()

    if (existing) {
      const { error } = await supabaseServer
        .from('content')
        .update({
          value: payload.value,
          updated_by: payload.updated_by,
          updated_at: new Date().toISOString(),
        })
        .eq('key', GROUPS_BG_KEY)

      if (error) throw error
    } else {
      const { error } = await supabaseServer
        .from('content')
        .insert([payload])

      if (error) throw error
    }

    return Response.json({
      success: true,
      message: 'Gruppen Banner gespeichert',
      data: {
        image_url: nextImageUrl,
      },
    })
  } catch (error: any) {
    console.error('Groups banner PUT error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Upload sponsor logo via server (bypasses storage RLS)
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.SPONSORS)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'Keine Datei ausgewählt' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Dateiformat nicht erlaubt' }, { status: 400 })
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return Response.json({ error: 'Datei zu groß (max. 2MB)' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `sponsor-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('sponsor-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Sponsor logo upload error:', uploadError)
      return Response.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('sponsor-images')
      .getPublicUrl(fileName)

    return Response.json({ url: publicUrl })
  } catch (error: any) {
    console.error('POST /api/admin/sponsors/upload error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove sponsor logo from storage
export async function DELETE(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.SPONSORS)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { url } = await req.json()
    if (!url || !url.includes('sponsor-images')) {
      return Response.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]

    await supabase.storage
      .from('sponsor-images')
      .remove([fileName])

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/admin/sponsors/upload error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

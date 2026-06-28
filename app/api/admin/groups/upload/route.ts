import { createClient } from '@supabase/supabase-js'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'group-logos'

// POST - Upload group logo via server (bypasses storage RLS)
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'Keine Datei ausgewählt' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Dateiformat nicht erlaubt' }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return Response.json({ error: 'Datei zu groß (max. 2MB)' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `group-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Ensure bucket exists (idempotent)
    await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {})

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Group logo upload error:', uploadError)
      return Response.json({ error: uploadError.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

    return Response.json({ url: publicUrl })
  } catch (error: any) {
    console.error('POST /api/admin/groups/upload error:', error)
    return Response.json({ error: 'Upload fehlgeschlagen' }, { status: 500 })
  }
}

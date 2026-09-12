import { createClient } from '@supabase/supabase-js'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// Ensure this runs on the Node.js runtime (Buffer / large bodies) and give
// a generous time budget for a single large image upload.
export const runtime = 'nodejs'
export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'images'
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB per file

// Map of accepted MIME types to a safe, canonical file extension.
// The extension is derived from the MIME type, never trusted from the filename.
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

let bucketEnsured = false

// Make sure the storage bucket exists and is public. Idempotent + cached per
// process so we only pay the round-trip once.
async function ensureBucket(): Promise<void> {
  if (bucketEnsured) return

  const { data: existing } = await supabase.storage.getBucket(BUCKET)
  if (existing) {
    bucketEnsured = true
    return
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
  })

  // If two requests race, the second createBucket returns a "already exists"
  // error which we can safely ignore.
  if (createError && !/exist/i.test(createError.message)) {
    throw createError
  }

  bucketEnsured = true
}

// POST - Upload a single image and return its public URL.
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.GALLERY)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = ((formData.get('folder') as string) || 'gallery').replace(/[^a-z0-9/_-]/gi, '')

    if (!file || typeof file.arrayBuffer !== 'function') {
      return Response.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
    }

    const mimeType = (file.type || '').toLowerCase()
    const ext = EXT_BY_MIME[mimeType]
    if (!ext) {
      return Response.json(
        { error: 'Ungültiges Dateiformat. Erlaubt: JPG, PNG, WEBP, GIF, AVIF' },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      return Response.json({ error: 'Datei ist leer' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'Datei zu groß (max. 25MB)' }, { status: 400 })
    }

    await ensureBucket()

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
    const filePath = `${folder}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

    return Response.json({ success: true, url: data.publicUrl, path: filePath }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/gallery/upload error:', error)
    return Response.json(
      { error: error?.message || 'Upload fehlgeschlagen' },
      { status: 500 }
    )
  }
}

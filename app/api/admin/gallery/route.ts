import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

export const runtime = 'nodejs'
export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface GalleryImage {
  url: string
  title: string
  description: string
  is_hidden: boolean
}

// Normalize any incoming image entry (string URL or partial object) into a
// complete image object.
function normalizeImage(entry: unknown): GalleryImage | null {
  if (typeof entry === 'string') {
    const url = entry.trim()
    return url ? { url, title: '', description: '', is_hidden: false } : null
  }
  if (entry && typeof entry === 'object' && 'url' in entry) {
    const obj = entry as Record<string, unknown>
    const url = typeof obj.url === 'string' ? obj.url.trim() : ''
    if (!url) return null
    return {
      url,
      title: typeof obj.title === 'string' ? obj.title : '',
      description: typeof obj.description === 'string' ? obj.description : '',
      is_hidden: obj.is_hidden === true,
    }
  }
  return null
}

// GET - All galleries
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.GALLERY)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    console.error('GET /api/admin/gallery error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create gallery.
// Preferred path: JSON body with already-uploaded image URLs
//   { title, category, description, is_published, images: [{url,...}] | [url] }
// Fallback path: multipart/form-data with image files (small batches only).
export async function POST(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.GALLERY)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const contentType = req.headers.get('content-type') || ''

    let title = ''
    let category = 'general'
    let description = ''
    let is_published = false
    let publish_at: string | null = null
    let imageObjects: GalleryImage[] = []

    if (contentType.includes('application/json')) {
      // --- Preferred path: images already uploaded, only metadata + URLs ---
      const body = await req.json()
      title = typeof body.title === 'string' ? body.title.trim() : ''
      category = typeof body.category === 'string' && body.category ? body.category : 'general'
      description = typeof body.description === 'string' ? body.description : ''
      is_published = body.is_published === true || body.is_published === 'true'
      publish_at = body.publish_at ? String(body.publish_at) : null

      const rawImages = Array.isArray(body.images) ? body.images : []
      imageObjects = rawImages
        .map(normalizeImage)
        .filter((img: GalleryImage | null): img is GalleryImage => img !== null)
    } else {
      // --- Fallback path: multipart form upload (kept for compatibility) ---
      const formData = await req.formData()
      title = ((formData.get('title') as string) || '').trim()
      category = (formData.get('category') as string) || 'general'
      description = (formData.get('description') as string) || ''
      is_published = formData.get('is_published') === 'true'
      const imageFiles = (formData.getAll('images') as File[]).filter(
        (f) => f && typeof (f as File).arrayBuffer === 'function'
      )

      for (const file of imageFiles) {
        const mimeType = (file.type || '').toLowerCase()
        const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
        const filePath = `gallery/${fileName}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, buffer, { contentType: mimeType || 'application/octet-stream', upsert: false })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath)
        imageObjects.push({ url: publicUrl, title: '', description: '', is_hidden: false })
      }
    }

    if (!title) {
      return Response.json({ error: 'Titel ist erforderlich' }, { status: 400 })
    }
    if (imageObjects.length === 0) {
      return Response.json({ error: 'Mindestens ein Bild ist erforderlich' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('gallery')
      .insert([{
        title,
        category,
        description,
        images: imageObjects,
        is_published,
        publish_at,
      }])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/gallery error:', error)
    return Response.json(
      { error: error?.message || 'Erstellen fehlgeschlagen' },
      { status: 500 }
    )
  }
}

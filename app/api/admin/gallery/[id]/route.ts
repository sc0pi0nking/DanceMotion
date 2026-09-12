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

// POST - Add images to existing gallery/album.
// Preferred path: JSON body { images: [{url,...}] | [url] } (already uploaded).
// Fallback path: multipart/form-data with image files.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.GALLERY)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const contentType = req.headers.get('content-type') || ''

    let newImageObjects: GalleryImage[] = []

    if (contentType.includes('application/json')) {
      const body = await req.json()
      const rawImages = Array.isArray(body.images) ? body.images : []
      newImageObjects = rawImages
        .map(normalizeImage)
        .filter((img: GalleryImage | null): img is GalleryImage => img !== null)
    } else {
      const formData = await req.formData()
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

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath)
        newImageObjects.push({ url: publicUrl, title: '', description: '', is_hidden: false })
      }
    }

    if (newImageObjects.length === 0) {
      return Response.json({ error: 'Keine Bilder übermittelt' }, { status: 400 })
    }

    // Get existing gallery
    const { data: gallery, error: fetchError } = await supabaseServer
      .from('gallery')
      .select('images')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Merge with existing images
    const existingImages = Array.isArray(gallery.images) ? gallery.images : []
    const updatedImages = [...existingImages, ...newImageObjects]

    const { data, error } = await supabaseServer
      .from('gallery')
      .update({ images: updatedImages })
      .eq('id', id)
      .select()

    if (error) throw error

    return Response.json(data[0])
  } catch (error: any) {
    console.error('POST /api/admin/gallery/[id] error:', error)
    return Response.json({ error: error?.message || 'Hinzufügen fehlgeschlagen' }, { status: 500 })
  }
}

// PATCH - Update gallery metadata, image metadata, or delete image
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.GALLERY)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { action, imageIndex, metadata } = body

    // Update gallery-level metadata (title, category, description, is_published)
    if (action === 'update_gallery') {
      const updateData: Record<string, any> = {}
      if (metadata.title !== undefined) updateData.title = metadata.title
      if (metadata.category !== undefined) updateData.category = metadata.category
      if (metadata.description !== undefined) updateData.description = metadata.description
      if (metadata.is_published !== undefined) updateData.is_published = metadata.is_published

      const { data, error } = await supabaseServer
        .from('gallery')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    const { data: gallery, error: fetchError } = await supabaseServer
      .from('gallery')
      .select('images')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    let updatedImages = Array.isArray(gallery.images) ? [...gallery.images] : []

    if (action === 'update_image' && imageIndex !== undefined) {
      // Update image metadata
      if (updatedImages[imageIndex]) {
        updatedImages[imageIndex] = {
          ...updatedImages[imageIndex],
          ...metadata,
        }
      }
    } else if (action === 'delete_image' && imageIndex !== undefined) {
      // Delete image and remove from storage
      const imageToDelete = updatedImages[imageIndex]
      if (imageToDelete) {
        const imageUrl = typeof imageToDelete === 'string' ? imageToDelete : imageToDelete.url
        const urlParts = imageUrl.split('/storage/v1/object/public/images/')
        if (urlParts[1]) {
          await supabase.storage.from('images').remove([urlParts[1]])
        }
        updatedImages.splice(imageIndex, 1)
      }
    }

    const { data, error } = await supabaseServer
      .from('gallery')
      .update({ images: updatedImages })
      .eq('id', id)
      .select()

    if (error) throw error

    return Response.json(data[0])
  } catch (error: any) {
    console.error('PATCH /api/admin/gallery/[id] error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove gallery and its images
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.GALLERY)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // Get gallery to find image URLs
    const { data: gallery, error: fetchError } = await supabaseServer
      .from('gallery')
      .select('images')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Delete images from storage
    if (gallery?.images && Array.isArray(gallery.images)) {
      for (const image of gallery.images) {
        const imageUrl = typeof image === 'string' ? image : image.url
        const urlParts = imageUrl.split('/storage/v1/object/public/images/')
        if (urlParts[1]) {
          await supabase.storage
            .from('images')
            .remove([urlParts[1]])
        }
      }
    }

    // Delete gallery entry
    const { error } = await supabaseServer
      .from('gallery')
      .delete()
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/admin/gallery/[id] error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

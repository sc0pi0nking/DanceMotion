import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Add images to existing gallery/album
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
    const formData = await req.formData()
    const imageFiles = formData.getAll('images') as File[]

    if (imageFiles.length === 0) {
      return Response.json({ error: 'Keine Bilder ausgewählt' }, { status: 400 })
    }

    // Get existing gallery
    const { data: gallery, error: fetchError } = await supabaseServer
      .from('gallery')
      .select('images')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Upload new images
    const newImageObjects: { url: string; title: string; description: string; is_hidden: boolean }[] = []

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, buffer, { contentType: file.type, upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      newImageObjects.push({ url: publicUrl, title: '', description: '', is_hidden: false })
    }

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
    return Response.json({ error: error.message }, { status: 500 })
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

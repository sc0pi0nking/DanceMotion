import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PATCH - Update image metadata or delete image
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { action, imageIndex, metadata } = body

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

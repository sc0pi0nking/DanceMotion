import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
      for (const imageUrl of gallery.images as string[]) {
        // Extract path from URL
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

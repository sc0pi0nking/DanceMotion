import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Return albums with cover image and image count
    const albums = (data || []).map((gallery) => {
      const images = (gallery.images as any[]) || []
      const visibleImages = images.filter((img) => {
        if (typeof img === 'string') return true
        return !img.is_hidden
      })

      const coverImage = visibleImages[0]
      const coverUrl = coverImage
        ? typeof coverImage === 'string'
          ? coverImage
          : coverImage.url
        : null

      return {
        id: gallery.id,
        title: gallery.title,
        category: gallery.category,
        description: gallery.description || '',
        cover_image: coverUrl,
        image_count: visibleImages.length,
        created_at: gallery.created_at,
      }
    }).filter((album) => album.image_count > 0)

    return Response.json(albums)
  } catch (error: any) {
    console.error('GET /api/gallery error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

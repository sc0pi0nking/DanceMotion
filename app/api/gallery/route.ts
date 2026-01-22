import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform to flat image list, filtering out hidden images
    const images = data.flatMap((gallery) => 
      (gallery.images as any[]).map((image: any, index: number) => {
        const imageUrl = typeof image === 'string' ? image : image.url
        const imageTitle = typeof image === 'string' ? '' : (image.title || '')
        const imageDescription = typeof image === 'string' ? '' : (image.description || '')
        const isHidden = typeof image === 'string' ? false : (image.is_hidden || false)
        
        return {
          id: `${gallery.id}-${index}`,
          url: imageUrl,
          title: imageTitle || gallery.title,
          description: imageDescription,
          category: gallery.category,
          is_hidden: isHidden,
        }
      }).filter(img => !img.is_hidden) // Filter out hidden images
    )

    return Response.json(images)
  } catch (error: any) {
    console.error('GET /api/gallery error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

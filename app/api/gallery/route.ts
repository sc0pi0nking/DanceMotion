import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform to flat image list
    const images = data.flatMap((gallery) => 
      (gallery.images as string[]).map((url: string, index: number) => ({
        id: `${gallery.id}-${index}`,
        url,
        title: gallery.title,
        category: gallery.category,
      }))
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

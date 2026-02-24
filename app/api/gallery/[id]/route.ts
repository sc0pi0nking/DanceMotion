import { supabaseServer } from '@/lib/supabase'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseServer
      .from('gallery')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      return Response.json(
        { error: 'Album nicht gefunden' },
        { status: 404 }
      )
    }

    const images = ((data.images as any[]) || [])
      .map((img: any, index: number) => {
        const url = typeof img === 'string' ? img : img.url
        const title = typeof img === 'string' ? '' : (img.title || '')
        const description = typeof img === 'string' ? '' : (img.description || '')
        const isHidden = typeof img === 'string' ? false : (img.is_hidden || false)
        return { id: `${data.id}-${index}`, url, title, description, is_hidden: isHidden }
      })
      .filter((img) => !img.is_hidden)

    return Response.json({
      id: data.id,
      title: data.title,
      category: data.category,
      description: data.description || '',
      images,
      created_at: data.created_at,
    })
  } catch (error: any) {
    console.error('GET /api/gallery/[id] error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

import { supabaseServer } from '@/lib/supabase'
import AlbumDetailView from '../../components/AlbumDetailView'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const { data } = await supabaseServer
      .from('gallery')
      .select('title, description')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (data) {
      return {
        title: `${data.title} — Galerie — DanceMotion Eschweiler`,
        description: data.description || `Bildergalerie: ${data.title}`,
      }
    }
  } catch {
    // Fallback metadata
  }

  return {
    title: 'Album — Galerie — DanceMotion Eschweiler',
    description: 'Bildergalerie von DanceMotion Eschweiler',
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <AlbumDetailView albumId={id} />
    </div>
  )
}

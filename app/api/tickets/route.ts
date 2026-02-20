import { supabaseServer } from '@/lib/supabase'

// POST - Create anonymous ticket
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, category, priority, attachments } = body

    if (!title || !description || !category) {
      return Response.json(
        { error: 'Titel, Beschreibung und Kategorie erforderlich' },
        { status: 400 }
      )
    }

    // Validate attachments if provided
    const validAttachments = Array.isArray(attachments)
      ? attachments.filter((url: string) => typeof url === 'string' && url.startsWith('http')).slice(0, 5)
      : []

    const { data, error } = await supabaseServer
      .from('tickets')
      .insert([{
        title,
        description,
        category,
        priority: priority || 'normal',
        status: 'open',
        admin_notes: [],
        attachments: validAttachments,
      }])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/tickets error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

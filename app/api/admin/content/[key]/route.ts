import { supabaseServer } from '@/lib/supabase'
import type { ContentItem } from '@/lib/supabase'

// GET - Fetch single content item
export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const { data, error } = await supabaseServer
      .from('content')
      .select('*')
      .eq('key', key)
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update content item
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const item: Partial<ContentItem> = await req.json()

    const { data, error } = await supabaseServer
      .from('content')
      .update({
        ...item,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)
      .select()

    if (error) throw error

    return Response.json(data[0])
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

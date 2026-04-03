import { supabaseServer } from '@/lib/supabase'

// Public read-only endpoint for a single content key
export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params

    if (!key || key.trim().length === 0) {
      return Response.json({ error: 'Invalid key' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('content')
      .select('key, value')
      .eq('key', key)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return Response.json({ key, value: null, text: null })
    }

    const textValue = typeof data.value === 'string'
      ? data.value
      : (typeof data.value?.text === 'string' ? data.value.text : null)

    return Response.json({
      key: data.key,
      value: data.value,
      text: textValue,
    })
  } catch (error: any) {
    console.error('Public content key API error:', error)
    return Response.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

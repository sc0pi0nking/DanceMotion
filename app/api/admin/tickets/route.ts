import { supabaseServer } from '@/lib/supabase'

// GET - All tickets (admin only)
export async function GET() {
  try {
    // TODO: Verify admin permission with tickets_admin

    const { data, error } = await supabaseServer
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    console.error('GET /api/admin/tickets error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

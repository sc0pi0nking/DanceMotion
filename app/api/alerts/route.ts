import { supabaseServer } from '@/lib/supabase'

// GET - Fetch active alerts (excludes admin-only alerts for public users)
export async function GET() {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabaseServer
      .from('system_alerts')
      .select('*')
      .lte('start_date', now)
      .gte('end_date', now)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    console.error('Failed to fetch alerts:', error)
    return Response.json([], { status: 200 })
  }
}

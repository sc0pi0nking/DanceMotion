import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// GET - All tickets (admin only)
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.TICKETS_ADMIN)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

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

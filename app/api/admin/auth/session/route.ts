import { getAdminSession } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getAdminSession()

    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch user role from admin_users table
    const { data: adminUser, error } = await supabaseServer
      .from('admin_users')
      .select('role_id')
      .eq('id', user.email)
      .single()

    const userWithRole = {
      ...user,
      role: adminUser?.role_id || 'admin'
    }

    return Response.json({ user: userWithRole })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

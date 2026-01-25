import { getAdminSession } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'

// Helper to check admin permissions
async function checkAdminPermission() {
  try {
    const user = await getAdminSession()
    if (!user) {
      return { authorized: false, user: null }
    }

    // Fetch user with role and permissions from admin_users_with_roles view
    const { data: adminUser, error } = await supabaseServer
      .from('admin_users_with_roles')
      .select('permissions')
      .eq('id', user.id)
      .single()

    if (error || !adminUser) {
      console.error('Failed to fetch admin user:', error)
      return { authorized: false, user }
    }

    const permissions = Array.isArray(adminUser.permissions) ? adminUser.permissions : []
    const hasPermission = permissions.includes('alerts_admin')
    
    return { authorized: hasPermission, user }
  } catch (error) {
    console.error('Permission check failed:', error)
    return { authorized: false, user: null }
  }
}

// DELETE - Remove alert
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await checkAdminPermission()
    if (!authorized) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { error } = await supabaseServer
      .from('system_alerts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

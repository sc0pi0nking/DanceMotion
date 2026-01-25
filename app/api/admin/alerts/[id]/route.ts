import { supabaseServer } from '@/lib/supabase'

// Helper to check admin permissions
async function checkAdminPermission() {
  try {
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser()
    if (!user || userError) {
      return { authorized: false, user: null }
    }

    // Check if user has alerts_admin permission
    const { data: roleData, error: roleError } = await supabaseServer
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id)
      .single()

    if (roleError) {
      return { authorized: false, user }
    }

    const { data: permData, error: permError } = await supabaseServer
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', roleData.role_id)

    if (permError) {
      return { authorized: false, user }
    }

    // Get the permission IDs
    const { data: permissions, error: permIdError } = await supabaseServer
      .from('permissions')
      .select('id')
      .eq('name', 'alerts_admin')

    if (permIdError || !permissions || permissions.length === 0) {
      return { authorized: false, user }
    }

    const hasPermission = permData.some(p => p.permission_id === permissions[0].id)
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

import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'

// Helper to check admin permissions
async function checkAdminPermission() {
  try {
    const user = await getAdminUserWithPermissions()
    if (!user) {
      return { authorized: false, user: null }
    }

    const hasPermission = user.permissions.includes(PERMISSIONS.ALERTS_ADMIN)
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

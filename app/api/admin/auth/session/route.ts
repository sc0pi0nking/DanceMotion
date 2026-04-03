import { requirePermission, PERMISSIONS } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'
import { getSystemSettings } from '@/lib/settings'

export async function GET() {
  try {
    const user = await requirePermission(PERMISSIONS.DASHBOARD)

    // Get system settings for session timeout
    const settings = await getSystemSettings()

    // Fetch user with role and permissions from admin_users_with_roles view
    const { data: adminUser, error } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !adminUser || !adminUser.is_active) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userWithRole = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role_name || 'admin',
      role_name: adminUser.role_name || 'admin',
      permissions: Array.isArray(adminUser.permissions) ? adminUser.permissions : [],
      is_active: adminUser.is_active,
    }

    return Response.json({ 
      user: userWithRole,
      session: {
        timeout_minutes: settings.session_timeout_minutes,
      }
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith('Unauthorized')) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
      }
      if (error.message.startsWith('Forbidden')) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}

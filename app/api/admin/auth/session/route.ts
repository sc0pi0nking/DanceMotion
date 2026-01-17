import { getAdminSession } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getAdminSession()

    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch user with role and permissions from admin_users_with_roles view
    const { data: adminUser, error } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !adminUser) {
      // User exists in auth but not in admin_users - treat as basic admin
      const userWithRole = {
        id: user.id,
        email: user.email,
        name: null,
        role: 'admin',
        role_name: 'admin',
        permissions: ['dashboard', 'events', 'recurring', 'content', 'gallery', 'documents', 'faqs', 'team', 'social', 'users', 'roles', 'analytics', 'settings'],
        is_active: true,
      }
      return Response.json({ user: userWithRole })
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

    return Response.json({ user: userWithRole })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}

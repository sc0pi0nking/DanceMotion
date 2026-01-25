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

// GET - Fetch all alerts (admin only)
export async function GET() {
  try {
    const { authorized, user } = await checkAdminPermission()
    if (!authorized) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabaseServer
      .from('system_alerts')
      .select('*')
      .order('end_date', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new alert (admin only)
export async function POST(req: Request) {
  try {
    const { authorized, user } = await checkAdminPermission()
    if (!authorized) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, message, alert_type, priority, start_date, end_date, is_dismissible, visible_to_admins_only } = body

    // Validate input
    if (!title || !message || !alert_type || !start_date || !end_date) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return Response.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('system_alerts')
      .insert([{
        title,
        message,
        alert_type,
        priority: priority || 0,
        start_date,
        end_date,
        is_dismissible,
        visible_to_admins_only: visible_to_admins_only || false,
        created_by: user!.id,
      }])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('Alert creation failed:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

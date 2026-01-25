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
    const { title, message, alert_type, priority, start_date, end_date, is_dismissible } = body

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

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { logRoleAction } from '@/lib/audit-logger'

// GET: Alle Rollen laden
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    console.log('Roles API - currentUser:', currentUser ? { id: currentUser.id, email: currentUser.email, permissions: currentUser.permissions } : 'null')
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!currentUser.permissions.includes(PERMISSIONS.ROLES)) {
      return NextResponse.json({ error: 'Missing roles permission', userPermissions: currentUser.permissions }, { status: 403 })
    }

    // Rollen mit User-Count laden
    const { data: roles, error } = await supabaseServer
      .from('admin_roles')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching roles:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // User-Count pro Rolle hinzufügen
    const { data: userCounts } = await supabaseServer
      .from('admin_users')
      .select('role_id')

    const countMap = new Map<string, number>()
    userCounts?.forEach(u => {
      if (u.role_id) {
        countMap.set(u.role_id, (countMap.get(u.role_id) || 0) + 1)
      }
    })

    const rolesWithCount = roles?.map(role => ({
      ...role,
      user_count: countMap.get(role.id) || 0,
    }))

    return NextResponse.json(rolesWithCount)
  } catch (error) {
    console.error('Roles GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Neue Rolle erstellen
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.ROLES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, permissions } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('admin_roles')
      .insert({
        name: name.toLowerCase().replace(/\s+/g, '-'),
        description: description || null,
        permissions: permissions || [],
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Role name already exists' }, { status: 400 })
      }
      console.error('Role creation failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Audit Log
    await logRoleAction(
      currentUser.id,
      'create',
      data.id,
      { name, description, permissions },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Roles POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { logUserAction } from '@/lib/audit-logger'

// GET: Alle User mit Rollen laden
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    console.log('Users API - currentUser:', currentUser ? { id: currentUser.id, email: currentUser.email, permissions: currentUser.permissions } : 'null')
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!currentUser.permissions.includes(PERMISSIONS.USERS)) {
      return NextResponse.json({ error: 'Missing users permission', userPermissions: currentUser.permissions }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Neuen User erstellen
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.USERS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { email, password, name, role_id, phone } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // 1. User in Supabase Auth erstellen
    const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm
    })

    if (authError) {
      console.error('Auth user creation failed:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }

    // 2. User in admin_users Tabelle eintragen
    const { data: adminUser, error: dbError } = await supabaseServer
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email,
        name: name || null,
        role_id: role_id || null,
        phone: phone || null,
        is_active: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Admin user DB insert failed:', dbError)
      // Rollback: Auth-User löschen
      await supabaseServer.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // 3. Audit Log
    await logUserAction(
      currentUser.id,
      'create',
      authData.user.id,
      { email, name, role_id },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return NextResponse.json(adminUser, { status: 201 })
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

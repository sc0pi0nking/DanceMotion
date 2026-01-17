import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { logUserAction } from '@/lib/audit-logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: Einzelnen User laden
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.USERS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('User GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: User aktualisieren
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.USERS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, role_id, phone, is_active, password } = body

    // Update admin_users Tabelle
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (role_id !== undefined) updateData.role_id = role_id
    if (phone !== undefined) updateData.phone = phone
    if (is_active !== undefined) updateData.is_active = is_active

    if (Object.keys(updateData).length > 0) {
      const { error: dbError } = await supabaseServer
        .from('admin_users')
        .update(updateData)
        .eq('id', id)

      if (dbError) {
        console.error('User update failed:', dbError)
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }
    }

    // Passwort ändern (optional)
    if (password) {
      const { error: authError } = await supabaseServer.auth.admin.updateUserById(id, {
        password,
      })

      if (authError) {
        console.error('Password update failed:', authError)
        return NextResponse.json({ error: 'Password update failed' }, { status: 500 })
      }
    }

    // Audit Log
    await logUserAction(
      currentUser.id,
      password ? 'password_change' : 'update',
      id,
      { ...updateData, password_changed: !!password },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    // Aktualisierten User laden
    const { data: updatedUser } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*')
      .eq('id', id)
      .single()

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('User PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: User löschen
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.USERS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Selbst-Löschung verhindern
    if (currentUser.id === id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    // User-Daten für Audit-Log laden
    const { data: userData } = await supabaseServer
      .from('admin_users')
      .select('email, name')
      .eq('id', id)
      .single()

    // 1. Aus admin_users löschen
    const { error: dbError } = await supabaseServer
      .from('admin_users')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('User DB delete failed:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // 2. Aus Supabase Auth löschen
    const { error: authError } = await supabaseServer.auth.admin.deleteUser(id)

    if (authError) {
      console.error('Auth user delete failed:', authError)
      // Kein Rollback nötig - User ist schon aus DB gelöscht
    }

    // Audit Log
    await logUserAction(
      currentUser.id,
      'delete',
      id,
      { deleted_user: userData },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

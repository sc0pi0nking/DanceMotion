import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { logRoleAction } from '@/lib/audit-logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: Einzelne Rolle laden
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.ROLES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabaseServer
      .from('admin_roles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Role GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Rolle aktualisieren
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.ROLES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, permissions } = body

    // Prüfe ob es die admin-Rolle ist
    const { data: existingRole } = await supabaseServer
      .from('admin_roles')
      .select('name')
      .eq('id', id)
      .single()

    if (existingRole?.name === 'admin') {
      // Admin-Rolle darf nicht umbenannt werden
      if (name && name !== 'admin') {
        return NextResponse.json({ error: 'Cannot rename admin role' }, { status: 400 })
      }
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.toLowerCase().replace(/\s+/g, '-')
    if (description !== undefined) updateData.description = description
    if (permissions !== undefined) updateData.permissions = permissions

    const { data, error } = await supabaseServer
      .from('admin_roles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Role name already exists' }, { status: 400 })
      }
      console.error('Role update failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Audit Log
    await logRoleAction(
      currentUser.id,
      'update',
      id,
      updateData,
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Role PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Rolle löschen
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.ROLES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prüfe ob es die admin-Rolle ist
    const { data: role } = await supabaseServer
      .from('admin_roles')
      .select('name')
      .eq('id', id)
      .single()

    if (role?.name === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin role' }, { status: 400 })
    }

    // Prüfe ob User diese Rolle haben
    const { data: usersWithRole } = await supabaseServer
      .from('admin_users')
      .select('id')
      .eq('role_id', id)

    if (usersWithRole && usersWithRole.length > 0) {
      return NextResponse.json({ 
        error: `Cannot delete role: ${usersWithRole.length} user(s) assigned` 
      }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from('admin_roles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Role delete failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Audit Log
    await logRoleAction(
      currentUser.id,
      'delete',
      id,
      { deleted_role: role?.name },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Role DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

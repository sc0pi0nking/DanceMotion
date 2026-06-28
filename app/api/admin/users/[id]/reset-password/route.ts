import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { validatePassword } from '@/lib/validators'
import { logUserAction } from '@/lib/audit-logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const currentUser = await getAdminUserWithPermissions()

    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.USERS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { new_password } = body

    if (!new_password || typeof new_password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const passwordValidation = validatePassword(new_password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Update password in Supabase Auth
    const { error: authError } = await supabaseServer.auth.admin.updateUserById(id, {
      password: new_password,
    })

    if (authError) {
      console.error('Password reset failed:', authError)
      return NextResponse.json({ error: 'Password reset failed' }, { status: 500 })
    }

    // Log the password reset action
    await logUserAction(
      currentUser.id,
      'password_change',
      id,
      { reset_by_admin: true, reset_at: new Date().toISOString() },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { supabaseServer } from '@/lib/supabase'
import { logLoginAction } from '@/lib/audit-logger'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Sign up or sign in with Supabase
    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Log failed login attempt
      await logLoginAction(
        email,
        false,
        req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        error.message
      )
      return Response.json({ error: error.message }, { status: 401 })
    }

    if (!data.user?.id || !data.session?.access_token) {
      return Response.json({ error: 'Login failed' }, { status: 401 })
    }

    // Security gate: user must exist in admin_users and be active
    const { data: adminUser, error: adminError } = await supabaseServer
      .from('admin_users')
      .select('id, is_active, force_password_change')
      .eq('id', data.user.id)
      .maybeSingle()

    if (adminError || !adminUser || adminUser.is_active !== true) {
      await supabaseServer.auth.signOut()
      await logLoginAction(
        data.user.email || email,
        false,
        req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        'Forbidden: inactive or missing admin user'
      )
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const requirePasswordChange = adminUser.force_password_change === true

    // Update last_login in admin_users table
    await supabaseServer
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)

    // Log successful login
    await logLoginAction(
      data.user.id,
      true,
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({
      success: true,
      user: data.user,
      requirePasswordChange,
    })
  } catch (error) {
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

import { supabaseServer } from '@/lib/supabase'
import { requirePermission, PERMISSIONS } from '@/lib/auth'
import { getSystemSettings } from '@/lib/settings'
import { validatePassword } from '@/lib/password-validation'
import { logUserAction } from '@/lib/audit-logger'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await requirePermission(PERMISSIONS.DASHBOARD)

    const { newPassword, confirmPassword } = await req.json()

    // Check passwords match
    if (newPassword !== confirmPassword) {
      return Response.json({ error: 'Passwörter stimmen nicht überein' }, { status: 400 })
    }

    // Get system settings for password validation
    const settings = await getSystemSettings()

    // Validate password against requirements
    const validation = validatePassword(newPassword, settings)
    if (!validation.valid) {
      return Response.json({ 
        error: 'Passwort erfüllt nicht die Anforderungen',
        details: validation.errors 
      }, { status: 400 })
    }

    // Update password in Supabase Auth
    const { error: authError } = await supabaseServer.auth.admin.updateUserById(
      currentUser.id,
      { password: newPassword }
    )

    if (authError) {
      console.error('Password update failed:', authError)
      return Response.json({ error: 'Passwort konnte nicht geändert werden' }, { status: 500 })
    }

    // Clear force_password_change flag
    const { error: dbError } = await supabaseServer
      .from('admin_users')
      .update({ force_password_change: false })
      .eq('id', currentUser.id)

    if (dbError) {
      console.error('Failed to clear force_password_change:', dbError)
    }

    // Log password change
    await logUserAction(
      currentUser.id,
      'password_change',
      currentUser.id,
      { self_change: true, forced: true },
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    )

    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('Change password error:', error)
    return Response.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
  }
}

// GET: Get password requirements
export async function GET() {
  try {
    const settings = await getSystemSettings()
    
    return Response.json({
      min_password_length: settings.min_password_length,
      require_special_chars: settings.require_special_chars,
      requirements: [
        `Mindestens ${settings.min_password_length} Zeichen`,
        'Mindestens ein Großbuchstabe',
        'Mindestens ein Kleinbuchstabe',
        'Mindestens eine Zahl',
        ...(settings.require_special_chars ? ['Mindestens ein Sonderzeichen (!@#$%^&*...)'] : []),
      ]
    })
  } catch (error) {
    return Response.json({ error: 'Failed to get requirements' }, { status: 500 })
  }
}

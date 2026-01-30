import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// Default system settings
const DEFAULT_SETTINGS = {
  // Website
  site_title: 'DanceMotion Eschweiler',
  site_description: 'Offene Tanzgemeinschaft in Eschweiler',
  // Design
  default_theme: 'dark',
  accent_color: '#2ec4c6',
  // Security
  session_timeout_minutes: 60,
  min_password_length: 8,
  require_special_chars: true,
  max_login_attempts: 5,
  lockout_duration_minutes: 15,
  // Events
  default_event_duration: 90,
  show_past_events_days: 7,
  enable_event_reminders: true,
  // Audit
  audit_retention_days: 90,
  enable_audit_logging: true,
}

// GET - Fetch all system settings
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all settings from content table with section 'settings'
    const { data, error } = await supabaseServer
      .from('content')
      .select('key, value')
      .eq('section', 'settings')

    if (error) throw error

    // Convert array to object and merge with defaults
    const settings: Record<string, any> = { ...DEFAULT_SETTINGS }
    
    if (data) {
      for (const item of data) {
        const key = item.key.replace('setting_', '')
        // value is already JSONB, so it's parsed automatically
        // Handle both direct values and wrapped objects
        if (typeof item.value === 'object' && item.value !== null && 'v' in item.value) {
          settings[key] = item.value.v
        } else {
          settings[key] = item.value
        }
      }
    }

    return Response.json({ 
      success: true, 
      settings,
      defaults: DEFAULT_SETTINGS
    })
  } catch (error: any) {
    console.error('Settings GET error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update system settings
export async function PUT(req: Request) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden - requires content permission' }, { status: 403 })
    }

    const { settings } = await req.json()
    
    if (!settings || typeof settings !== 'object') {
      return Response.json({ error: 'Settings object is required' }, { status: 400 })
    }

    // Update each setting sequentially
    for (const [key, value] of Object.entries(settings)) {
      const contentKey = `setting_${key}`
      // Store value wrapped in object for JSONB compatibility
      // This ensures strings, numbers, booleans all work correctly
      const jsonbValue = { v: value }

      // Check if setting exists
      const { data: existing } = await supabaseServer
        .from('content')
        .select('id')
        .eq('key', contentKey)
        .eq('section', 'settings')
        .single()

      if (existing) {
        // Update existing
        await supabaseServer
          .from('content')
          .update({ 
            value: jsonbValue, 
            updated_at: new Date().toISOString(),
            updated_by: currentUser.email || 'system'
          })
          .eq('key', contentKey)
      } else {
        // Create new
        await supabaseServer
          .from('content')
          .insert([{ 
            key: contentKey, 
            value: jsonbValue, 
            section: 'settings',
            updated_by: currentUser.email || 'system'
          }])
      }
    }

    return Response.json({ 
      success: true, 
      message: 'Settings saved successfully',
      updated: Object.keys(settings).length
    })
  } catch (error: any) {
    console.error('Settings PUT error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

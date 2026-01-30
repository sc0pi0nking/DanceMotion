import { supabaseServer } from './supabase'

// Default system settings
export const DEFAULT_SETTINGS = {
  // Website
  site_title: 'DanceMotion Eschweiler',
  site_description: 'Offene Tanzgemeinschaft in Eschweiler',
  // Design
  default_theme: 'dark' as const,
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

export type SystemSettings = typeof DEFAULT_SETTINGS

// Cache for settings (5 minute TTL)
let settingsCache: { data: SystemSettings; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch system settings from database
 * Server-side only - use /api/admin/settings for client-side
 */
export async function getSystemSettings(): Promise<SystemSettings> {
  // Check cache
  if (settingsCache && Date.now() - settingsCache.timestamp < CACHE_TTL) {
    return settingsCache.data
  }

  try {
    const { data, error } = await supabaseServer
      .from('content')
      .select('key, value')
      .eq('section', 'settings')

    if (error) throw error

    const settings: Record<string, any> = { ...DEFAULT_SETTINGS }

    if (data) {
      for (const item of data) {
        const key = item.key.replace('setting_', '')
        try {
          settings[key] = JSON.parse(item.value)
        } catch {
          settings[key] = item.value
        }
      }
    }

    // Update cache
    settingsCache = {
      data: settings as SystemSettings,
      timestamp: Date.now(),
    }

    return settings as SystemSettings
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * Get a specific setting value
 */
export async function getSetting<K extends keyof SystemSettings>(
  key: K
): Promise<SystemSettings[K]> {
  const settings = await getSystemSettings()
  return settings[key]
}

/**
 * Invalidate settings cache (call after updates)
 */
export function invalidateSettingsCache() {
  settingsCache = null
}

/**
 * Validate password against current settings
 */
export async function validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
  const settings = await getSystemSettings()
  const errors: string[] = []

  if (password.length < settings.min_password_length) {
    errors.push(`Passwort muss mindestens ${settings.min_password_length} Zeichen lang sein`)
  }

  if (settings.require_special_chars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Passwort muss mindestens ein Sonderzeichen enthalten')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

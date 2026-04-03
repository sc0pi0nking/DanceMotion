import { cookies } from 'next/headers'
import { supabaseServer } from './supabase'

// Alle verfügbaren Permissions
export const PERMISSIONS = {
  DASHBOARD: 'dashboard',
  EVENTS: 'events',
  RECURRING: 'recurring',
  CONTENT: 'content',
  GALLERY: 'gallery',
  DOCUMENTS: 'documents',
  FAQS: 'faqs',
  SPONSORS: 'sponsors',
  TEAM: 'team',
  WIKI_ADMIN: 'wiki_admin',
  WIKI_DEV: 'wiki_dev',
  SOCIAL: 'social',
  TICKETS_ADMIN: 'tickets_admin',
  ALERTS_ADMIN: 'alerts_admin',
  USERS: 'users',
  ROLES: 'roles',
  ANALYTICS: 'analytics',
  AUDIT: 'audit',
  SETTINGS: 'settings',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

export interface AdminUser {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
  role_id: string | null
  role_name: string | null
  role_description: string | null
  permissions: Permission[]
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (!token) {
      return null
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(token)

    if (error || !user) {
      return null
    }

    return user
  } catch {
    return null
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

/**
 * Lädt den User mit Rollen-Informationen und Permissions.
 * Sicherheitsregel: Kein impliziter Role/Permission-Fallback.
 */
export async function getAdminUserWithPermissions(): Promise<AdminUser | null> {
  try {
    const session = await getAdminSession()
    if (!session) return null

    // Versuche zuerst die View (wenn Migration gelaufen ist)
    const { data, error } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*')
      .eq('id', session.id)
      .maybeSingle()

    if (!error && data) {
      if (!data.is_active) {
        return null
      }

      return {
        ...data,
        permissions: Array.isArray(data.permissions) ? data.permissions : []
      } as AdminUser
    }

    // Fallback: View existiert noch nicht - lade direkt aus admin_users
    const { data: userData, error: userError } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('id', session.id)
      .maybeSingle()

    if (userError || !userData) {
      return null
    }

    if (!userData.is_active) {
      return null
    }

    // Lade Rolle separat falls vorhanden
    let permissions: Permission[] = []
    let roleName: string | null = null
    let roleDescription: string | null = null

    if (userData.role_id) {
      const { data: roleData } = await supabaseServer
        .from('admin_roles')
        .select('name, description, permissions')
        .eq('id', userData.role_id)
        .single()
      
      if (roleData) {
        roleName = roleData.name
        roleDescription = roleData.description
        permissions = Array.isArray(roleData.permissions) ? roleData.permissions : []
      }
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar_url: userData.avatar_url || null,
      phone: userData.phone || null,
      is_active: userData.is_active,
      last_login: userData.last_login,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      role_id: userData.role_id,
      role_name: roleName,
      role_description: roleDescription,
      permissions
    }
  } catch (err) {
    console.error('getAdminUserWithPermissions error:', err)
    return null
  }
}

/**
 * Prüft ob der aktuelle User eine bestimmte Permission hat
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const user = await getAdminUserWithPermissions()
  if (!user) return false
  
  // Inaktive User haben keine Permissions
  if (!user.is_active) return false
  
  // Prüfe ob User die Permission hat
  return user.permissions.includes(permission)
}

/**
 * Prüft ob der User mindestens eine der angegebenen Permissions hat
 */
export async function hasAnyPermission(permissions: Permission[]): Promise<boolean> {
  const user = await getAdminUserWithPermissions()
  if (!user || !user.is_active) return false
  
  return permissions.some(p => user.permissions.includes(p))
}

/**
 * Prüft ob der User alle angegebenen Permissions hat
 */
export async function hasAllPermissions(permissions: Permission[]): Promise<boolean> {
  const user = await getAdminUserWithPermissions()
  if (!user || !user.is_active) return false
  
  return permissions.every(p => user.permissions.includes(p))
}

/**
 * Require-Wrapper der einen Fehler wirft wenn Permission fehlt
 */
export async function requirePermission(permission: Permission): Promise<AdminUser> {
  const user = await getAdminUserWithPermissions()
  
  if (!user) {
    throw new Error('Unauthorized: Not logged in')
  }
  
  if (!user.permissions.includes(permission)) {
    throw new Error(`Forbidden: Missing permission '${permission}'`)
  }
  
  return user
}

/**
 * Mapping von Admin-Seiten zu benötigten Permissions
 */
export const PAGE_PERMISSIONS: Record<string, Permission> = {
  '/admin': PERMISSIONS.DASHBOARD,
  '/admin/events': PERMISSIONS.EVENTS,
  '/admin/recurring': PERMISSIONS.RECURRING,
  '/admin/content': PERMISSIONS.CONTENT,
  '/admin/hero-banner': PERMISSIONS.CONTENT,
  '/admin/groups-banner': PERMISSIONS.CONTENT,
  '/admin/gallery': PERMISSIONS.GALLERY,
  '/admin/documents': PERMISSIONS.DOCUMENTS,
  '/admin/faqs': PERMISSIONS.FAQS,
  '/admin/sponsors': PERMISSIONS.SPONSORS,
  '/admin/team': PERMISSIONS.TEAM,
  '/admin/social': PERMISSIONS.SOCIAL,
  '/admin/tickets': PERMISSIONS.TICKETS_ADMIN,
  '/admin/alerts': PERMISSIONS.ALERTS_ADMIN,
  '/admin/users': PERMISSIONS.USERS,
  '/admin/roles': PERMISSIONS.ROLES,
  '/admin/analytics': PERMISSIONS.ANALYTICS,
  '/admin/audit': PERMISSIONS.AUDIT,
  '/admin/settings': PERMISSIONS.SETTINGS,
  '/admin/wiki/admin': PERMISSIONS.WIKI_ADMIN,
  '/admin/wiki/dev': PERMISSIONS.WIKI_DEV,
}

/**
 * Prüft ob User Zugriff auf eine bestimmte Admin-Seite hat
 */
export async function canAccessPage(pathname: string): Promise<boolean> {
  // Login-Seite ist immer zugänglich
  if (pathname === '/admin/login') return true
  
  const user = await getAdminUserWithPermissions()
  if (!user || !user.is_active) return false
  
  // Finde die passende Permission für den Pfad
  const exactMatch = PAGE_PERMISSIONS[pathname]
  if (exactMatch) {
    return user.permissions.includes(exactMatch)
  }
  
  // Prüfe Prefix-Match (z.B. /admin/users/123)
  for (const [path, permission] of Object.entries(PAGE_PERMISSIONS)) {
    if (pathname.startsWith(path + '/')) {
      return user.permissions.includes(permission)
    }
  }
  
  // Unbekannte Seiten: Nur Dashboard-Permission erforderlich
  return user.permissions.includes(PERMISSIONS.DASHBOARD)
}

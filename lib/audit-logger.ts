import { supabaseServer } from './supabase'

export interface AuditLogEntry {
  user_id: string
  action: string
  target_type: string
  target_id?: string
  details?: Record<string, any>
  ip_address?: string
}

/**
 * Logs an action to the audit log table
 * Should be called by all admin APIs for create, update, delete operations
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const { error } = await supabaseServer
      .from('admin_audit_log')
      .insert({
        user_id: entry.user_id,
        action: entry.action,
        target_type: entry.target_type,
        target_id: entry.target_id || null,
        details: entry.details || {},
        ip_address: entry.ip_address || null,
      })

    if (error) {
      console.error('Failed to log audit entry:', error)
      // Don't throw - audit logging should not break the main operation
    }
  } catch (err) {
    console.error('Audit logging error:', err)
    // Silent fail - audit logging should never break functionality
  }
}

/**
 * Helper to log user operations
 */
export async function logUserAction(
  userId: string,
  action: 'create' | 'update' | 'delete' | 'login' | 'permission_change' | 'password_change' | 'deactivate' | 'activate',
  targetUserId: string,
  details?: Record<string, any>,
  ipAddress?: string
): Promise<void> {
  await logAudit({
    user_id: userId,
    action,
    target_type: 'user',
    target_id: targetUserId,
    details: {
      action_label: `User ${action}`,
      ...details,
    },
    ip_address: ipAddress,
  })
}

/**
 * Helper to log role operations
 */
export async function logRoleAction(
  userId: string,
  action: 'create' | 'update' | 'delete' | 'permission_change',
  targetRoleId: string,
  details?: Record<string, any>,
  ipAddress?: string
): Promise<void> {
  await logAudit({
    user_id: userId,
    action,
    target_type: 'role',
    target_id: targetRoleId,
    details: {
      action_label: `Role ${action}`,
      ...details,
    },
    ip_address: ipAddress,
  })
}

/**
 * Helper to log login events
 */
export async function logLoginAction(
  userId: string,
  success: boolean,
  ipAddress?: string,
  reason?: string
): Promise<void> {
  await logAudit({
    user_id: userId,
    action: success ? 'login' : 'login_failed',
    target_type: 'auth',
    target_id: userId,
    details: {
      success,
      reason: reason || null,
    },
    ip_address: ipAddress,
  })
}

/**
 * Helper to log logout events
 */
export async function logLogoutAction(
  userId: string,
  ipAddress?: string
): Promise<void> {
  await logAudit({
    user_id: userId,
    action: 'logout',
    target_type: 'auth',
    target_id: userId,
    ip_address: ipAddress,
  })
}

/**
 * Authentication and Authorization Helpers
 * Reusable functions for checking admin/user permissions
 */

import { supabaseServer } from './supabase';
import { NextRequest, NextResponse } from 'next/server';

export interface AdminUser {
  id: string;
  email: string;
  permissions: string[];
  role?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

/**
 * Get current user from request
 */
export async function getCurrentUser(authHeader: string | null): Promise<AuthUser | null> {
  if (!authHeader) return null;

  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    
    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email || '',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get admin user with permissions
 */
export async function getAdminUser(authHeader: string | null): Promise<AdminUser | null> {
  if (!authHeader) return null;

  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    
    if (userError || !user) return null;

    // Fetch user's role and permissions
    const { data: adminUser, error: roleError } = await supabaseServer
      .from('admin_users_with_roles')
      .select('*, admin_roles(name, permissions)')
      .eq('user_id', user.id)
      .single();

    if (roleError || !adminUser) return null;

    return {
      id: user.id,
      email: user.email || '',
      permissions: adminUser.admin_roles?.permissions || [],
      role: adminUser.admin_roles?.name,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Require admin status with optional permission check
 * @throws Error if not admin or missing permission
 */
export async function requireAdmin(
  authHeader: string | null,
  requiredPermission?: string
): Promise<AdminUser> {
  const adminUser = await getAdminUser(authHeader);
  
  if (!adminUser) {
    throw new Error('UNAUTHORIZED');
  }

  if (requiredPermission && !adminUser.permissions.includes(requiredPermission)) {
    throw new Error('FORBIDDEN');
  }

  return adminUser;
}

/**
 * Handle auth errors in API routes
 */
export function handleAuthError(error: any): NextResponse {
  if (error.message === 'UNAUTHORIZED') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  if (error.message === 'FORBIDDEN') {
    return NextResponse.json(
      { error: 'Forbidden - insufficient permissions' },
      { status: 403 }
    );
  }
  console.error('Auth error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

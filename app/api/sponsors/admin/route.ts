/**
 * GET /api/sponsors/admin - Fetch all sponsors (admin with sponsors permission)
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!currentUser.permissions.includes(PERMISSIONS.SPONSORS)) {
      return NextResponse.json(
        { error: 'Forbidden - Missing sponsors permission' },
        { status: 403 }
      );
    }

    const { data: sponsors, error } = await supabaseServer
      .from('sponsors')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET /api/sponsors/admin fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sponsors' },
        { status: 500 }
      );
    }

    return NextResponse.json(sponsors || []);
  } catch (error) {
    console.error('GET /api/sponsors/admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

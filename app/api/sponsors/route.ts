/**
 * GET /api/sponsors - Fetch all active sponsors
 * POST /api/sponsors - Create new sponsor (admin with sponsors permission)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { logAudit } from '@/lib/audit-logger';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { data: sponsors, error } = await supabaseServer
      .from('sponsors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Sponsors fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sponsors' },
        { status: 500 }
      );
    }

    return NextResponse.json(sponsors);
  } catch (error) {
    console.error('GET /api/sponsors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin permissions
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

    // Parse body
    const { name, description, logo_url, website_url, category } = await request.json();

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Sponsor name is required' },
        { status: 400 }
      );
    }

    if (name.length > 200) {
      return NextResponse.json(
        { error: 'Sponsor name is too long (max 200 chars)' },
        { status: 400 }
      );
    }

    // Insert sponsor
    const { data: sponsor, error: insertError } = await supabaseServer
      .from('sponsors')
      .insert([
        {
          name: name.trim(),
          description: description?.trim() || null,
          logo_url: logo_url || null,
          website_url: website_url || null,
          category: category || 'general',
          created_by: currentUser.id,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Sponsor insert error:', insertError);
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Sponsor already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create sponsor' },
        { status: 500 }
      );
    }

    // Log action
    await logAudit({
      user_id: currentUser.id,
      action: 'sponsor_created',
      target_type: 'sponsors',
      target_id: sponsor.id,
      details: { name },
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    console.error('POST /api/sponsors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

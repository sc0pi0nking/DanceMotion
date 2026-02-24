/**
 * GET /api/sponsors - Fetch all active sponsors
 * POST /api/sponsors - Create new sponsor (admin with sponsors permission)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { logAudit } from '@/lib/audit-logger';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

const ALLOWED_SPONSOR_CATEGORIES = ['general', 'venue', 'equipment', 'media', 'partner'] as const;

function validateExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Allow both http:// and https:// URLs (matching database constraint ^https?://)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

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
    const { name, description, logo_url, website_url, category, social_links } = await request.json();

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

    if (category !== undefined && !ALLOWED_SPONSOR_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Allowed values: general, venue, equipment, media, partner' },
        { status: 400 }
      );
    }

    if (typeof website_url === 'string' && website_url.trim().length > 0 && !validateExternalUrl(website_url.trim())) {
      return NextResponse.json(
        { error: 'Invalid website_url. URL must start with http:// or https://' },
        { status: 400 }
      );
    }

    if (typeof logo_url === 'string' && logo_url.trim().length > 0 && !validateExternalUrl(logo_url.trim())) {
      return NextResponse.json(
        { error: 'Invalid logo_url. URL must start with http:// or https://' },
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
          logo_url: typeof logo_url === 'string' ? logo_url.trim() || null : null,
          website_url: typeof website_url === 'string' ? website_url.trim() || null : null,
          category: category || 'general',
          social_links: social_links || {},
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

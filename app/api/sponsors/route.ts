/**
 * GET /api/sponsors - Fetch all active sponsors
 * POST /api/sponsors - Create new sponsor (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { logAudit } from '@/lib/audit-logger';

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
    // Get current user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
          created_by: user.id,
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
      user_id: user.id,
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

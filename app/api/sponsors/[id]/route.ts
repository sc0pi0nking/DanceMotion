/**
 * GET /api/sponsors/[id] - Get single sponsor
 * PUT /api/sponsors/[id] - Update sponsor (creator/admin only)
 * DELETE /api/sponsors/[id] - Delete sponsor (creator/admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { logAudit } from '@/lib/audit-logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: sponsor, error } = await supabaseServer
      .from('sponsors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      );
    }

    // For inactive sponsors, require authentication
    if (!sponsor.is_active) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(sponsor);
  } catch (error) {
    console.error('GET /api/sponsors/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Get sponsor to check ownership
    const { data: sponsor, error: fetchError } = await supabaseServer
      .from('sponsors')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      );
    }

    if (sponsor.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { name, description, logo_url, website_url, category, is_active, sort_order } = body;

    // Build update object
    const updateData: any = {};
    if (name !== undefined && name.trim().length > 0) {
      if (name.length > 200) {
        return NextResponse.json(
          { error: 'Sponsor name is too long (max 200 chars)' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (logo_url !== undefined) updateData.logo_url = logo_url || null;
    if (website_url !== undefined) updateData.website_url = website_url || null;
    if (category !== undefined) updateData.category = category;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    
    updateData.updated_at = new Date().toISOString();

    // Update sponsor
    const { data: updated, error: updateError } = await supabaseServer
      .from('sponsors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Sponsor update error:', updateError);
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'Sponsor name already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update sponsor' },
        { status: 500 }
      );
    }

    // Log action
    await logAudit({
      user_id: user.id,
      action: 'sponsor_updated',
      target_type: 'sponsors',
      target_id: id,
      details: { name: name || updated.name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/sponsors/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Get sponsor to check ownership
    const { data: sponsor, error: fetchError } = await supabaseServer
      .from('sponsors')
      .select('created_by, name')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      );
    }

    if (sponsor.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete sponsor
    const { error: deleteError } = await supabaseServer
      .from('sponsors')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Sponsor delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete sponsor' },
        { status: 500 }
      );
    }

    // Log action
    await logAudit({
      user_id: user.id,
      action: 'sponsor_deleted',
      target_type: 'sponsors',
      target_id: id,
      details: { name: sponsor.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/sponsors/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

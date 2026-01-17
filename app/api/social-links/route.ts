import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Type for social link
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// GET - fetch all visible social links (public)
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      // Table doesn't exist yet - return empty array
      if (error.code === '42P01' || error.message.includes("does not exist") || error.message.includes("relation")) {
        return NextResponse.json({ success: true, data: [] });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ success: true, data: [] }); // Graceful fallback
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching social links:', error);
    // Return empty array instead of error for public endpoint
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST - create new social link (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, url, icon, label, sort_order = 0, is_visible = true } = body;

    if (!platform || !url || !icon || !label) {
      return NextResponse.json(
        { success: false, error: 'Plattform, URL, Icon und Label sind erforderlich' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('social_links')
      .insert({ platform, url, icon, label, sort_order, is_visible })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating social link:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Erstellen des Social Links' },
      { status: 500 }
    );
  }
}

// PUT - update social link (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { id, platform, url, icon, label, sort_order, is_visible } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID ist erforderlich' },
        { status: 400 }
      );
    }

    const updates: Partial<SocialLink> = {};
    if (platform !== undefined) updates.platform = platform;
    if (url !== undefined) updates.url = url;
    if (icon !== undefined) updates.icon = icon;
    if (label !== undefined) updates.label = label;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_visible !== undefined) updates.is_visible = is_visible;

    const { data, error } = await supabaseServer
      .from('social_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating social link:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Aktualisieren des Social Links' },
      { status: 500 }
    );
  }
}

// DELETE - remove social link (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID ist erforderlich' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('social_links')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Löschen des Social Links' },
      { status: 500 }
    );
  }
}

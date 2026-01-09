import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle Team-Mitglieder (inkl. unveröffentlichte)
export async function GET() {
  try {
    const { data: members, error } = await supabaseServer
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(members || []);
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST - Neues Team-Mitglied erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, bio, image_url, order_index, social_links, published } = body;

    // Validierung
    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name und Rolle sind Pflichtfelder' },
        { status: 400 }
      );
    }

    const { data: member, error } = await supabaseServer
      .from('team_members')
      .insert({
        name,
        role,
        bio: bio || null,
        image_url: image_url || null,
        order_index: order_index || 0,
        social_links: social_links || {},
        published: published !== undefined ? published : true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create team member' },
      { status: 500 }
    );
  }
}

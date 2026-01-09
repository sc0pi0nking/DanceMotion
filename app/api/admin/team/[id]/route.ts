import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// PATCH - Team-Mitglied aktualisieren
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, role, bio, image_url, order_index, social_links, published } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (bio !== undefined) updateData.bio = bio;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (order_index !== undefined) updateData.order_index = order_index;
    if (social_links !== undefined) updateData.social_links = social_links;
    if (published !== undefined) updateData.published = published;

    const { data: member, error } = await supabaseServer
      .from('team_members')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE - Team-Mitglied löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseServer
      .from('team_members')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}

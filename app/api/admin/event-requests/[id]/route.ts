import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

// GET - Einzelne Event-Anfrage abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;

    const { data, error } = await supabase
      .from('event_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching event request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch event request' },
      { status: 500 }
    );
  }
}

// PATCH - Event-Anfrage aktualisieren (Status, Notizen, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;
    const body = await request.json();

    const { status, notes, assigned_to } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;

    const { data, error } = await supabase
      .from('event_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating event request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update event request' },
      { status: 500 }
    );
  }
}

// DELETE - Event-Anfrage löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;

    const { error } = await supabase
      .from('event_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting event request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete event request' },
      { status: 500 }
    );
  }
}

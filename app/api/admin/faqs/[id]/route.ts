import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

// PATCH - FAQ aktualisieren (Admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.FAQS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;
    const body = await request.json();

    const { question, answer, category, order_index, published } = body;

    // Validierung
    if (question !== undefined && question.length > 500) {
      return NextResponse.json(
        { error: 'Frage darf maximal 500 Zeichen lang sein' },
        { status: 400 }
      );
    }

    if (answer !== undefined && answer.length > 5000) {
      return NextResponse.json(
        { error: 'Antwort darf maximal 5000 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Update-Objekt zusammenstellen
    const updates: any = {};
    if (question !== undefined) updates.question = question.trim();
    if (answer !== undefined) updates.answer = answer.trim();
    if (category !== undefined) updates.category = category;
    if (order_index !== undefined) updates.order_index = order_index;
    if (published !== undefined) updates.published = published;

    const { data, error } = await supabase
      .from('faqs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE - FAQ löschen (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.FAQS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}

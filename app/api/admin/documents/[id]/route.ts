import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

// DELETE - Dokument löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.DOCUMENTS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;

    // Dokument aus DB abrufen
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_url, file_name')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Datei aus Storage löschen
    const filePath = `forms/${document.file_name}`;
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Trotzdem fortfahren - DB-Eintrag soll gelöscht werden
    }

    // Eintrag aus Datenbank löschen
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete document' },
      { status: 500 }
    );
  }
}

// PATCH - Dokument Status aktualisieren (z.B. is_active)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.DOCUMENTS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = supabaseServer;
    const body = await request.json();

    // Nur is_active kann aktualisiert werden
    const { is_active } = body;

    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active must be a boolean' },
        { status: 400 }
      );
    }

    // Dokument aktualisieren
    const { data: document, error } = await supabase
      .from('documents')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(document);
  } catch (error: any) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update document' },
      { status: 500 }
    );
  }
}
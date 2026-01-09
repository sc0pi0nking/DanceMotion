import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// DELETE - Dokument löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

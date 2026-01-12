import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle Dokumente abrufen (nur für Admins, auch inaktive)
export async function GET() {
  try {
    const supabase = supabaseServer;
    
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(documents || []);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST - Neues Dokument hochladen
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer;
    const formData = await request.formData();

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // PDF-Validierung
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Datei-Upload zu Supabase Storage
    const fileExt = 'pdf';
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `forms/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Public URL generieren
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Metadaten in Datenbank speichern
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        title,
        description: description || null,
        category: category || 'general',
        file_url: publicUrl,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type,
        is_active: true
      })
      .select()
      .single();

    if (dbError) {
      // Wenn DB-Insert fehlschlägt, Datei aus Storage löschen
      await supabase.storage.from('documents').remove([filePath]);
      throw dbError;
    }

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}

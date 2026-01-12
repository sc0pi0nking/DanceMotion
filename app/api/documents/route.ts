import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle öffentlichen Dokumente abrufen (nur aktive)
export async function GET(request: Request) {
  try {
    const supabase = supabaseServer;
    
    // Query Parameter prüfen - wenn ?admin=true, zeige auch inaktive
    const { searchParams } = new URL(request.url);
    const showInactive = searchParams.get('admin') === 'true';
    
    let query = supabase
      .from('documents')
      .select('*');
    
    // Nur aktive Dokumente für öffentliche API
    if (!showInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data: documents, error } = await query
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

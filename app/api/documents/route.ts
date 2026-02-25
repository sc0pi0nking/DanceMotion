import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle öffentlichen Dokumente abrufen (NUR aktive)
// NOTE: Admin-Zugriff (inkl. inaktive) nur über /api/admin/documents
export async function GET() {
  try {
    const supabase = supabaseServer;
    
    // Nur aktive Dokumente für öffentliche API - KEIN admin-Parameter mehr!
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('is_active', true)
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

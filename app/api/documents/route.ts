import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle öffentlichen Dokumente abrufen
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

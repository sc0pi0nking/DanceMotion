import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle veröffentlichten FAQs abrufen (öffentlich)
export async function GET() {
  try {
    const supabase = supabaseServer;
    
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(faqs || []);
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

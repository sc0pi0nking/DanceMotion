import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { serverError } from '@/lib/api-error';

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
  } catch (error) {
    return serverError('faqs.list', error);
  }
}

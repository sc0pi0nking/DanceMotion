import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET - Alle FAQs abrufen (Admin)
export async function GET() {
  try {
    const supabase = supabaseServer;
    
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select('*')
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

// POST - Neue FAQ erstellen (Admin)
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer;
    const body = await request.json();

    const { question, answer, category, order_index, published } = body;

    // Validierung
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Frage und Antwort sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Input-Längen-Limits
    if (question.length > 500) {
      return NextResponse.json(
        { error: 'Frage darf maximal 500 Zeichen lang sein' },
        { status: 400 }
      );
    }

    if (answer.length > 5000) {
      return NextResponse.json(
        { error: 'Antwort darf maximal 5000 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // FAQ erstellen
    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question: question.trim(),
        answer: answer.trim(),
        category: category || 'allgemein',
        order_index: order_index || 0,
        published: published !== undefined ? published : true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

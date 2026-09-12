import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { serverError } from '@/lib/api-error';

// GET - Alle veröffentlichten Team-Mitglieder (öffentlich)
export async function GET() {
  try {
    const { data: members, error } = await supabaseServer
      .from('team_members')
      .select('*')
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(members || []);
  } catch (error) {
    return serverError('team.list', error);
  }
}

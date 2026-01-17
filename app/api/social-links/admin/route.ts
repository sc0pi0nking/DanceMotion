import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';

// GET - fetch ALL social links for admin (including hidden)
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    // Fetch ALL links (including hidden) with service role
    const { data, error } = await supabaseServer
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      if (error.message.includes("does not exist")) {
        return NextResponse.json({ success: true, data: [] });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching social links for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Laden der Social Links' },
      { status: 500 }
    );
  }
}

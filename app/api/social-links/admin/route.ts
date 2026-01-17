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
      // Table doesn't exist yet - return empty array
      if (error.code === '42P01' || error.message.includes("does not exist") || error.message.includes("relation")) {
        return NextResponse.json({ success: true, data: [] });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ success: true, data: [] }); // Graceful fallback
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching social links for admin:', error);
    // Return empty array instead of error
    return NextResponse.json({ success: true, data: [] });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET - fetch ALL social links for admin (including hidden)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Nicht angemeldet' }, { status: 401 });
    }

    // Verify admin role
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(authToken);

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Nicht autorisiert' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.json({ success: false, error: 'Keine Admin-Berechtigung' }, { status: 403 });
    }

    // Fetch ALL links (including hidden) with service role
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching social links for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Laden der Social Links' },
      { status: 500 }
    );
  }
}

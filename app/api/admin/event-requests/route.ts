import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth';

// GET - Alle Event-Anfragen abrufen (nur für Admins mit EVENTS-Permission)
export async function GET() {
  try {
    const currentUser = await getAdminUserWithPermissions();
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = supabaseServer;
    
    const { data: requests, error } = await supabase
      .from('event_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(requests || []);
  } catch (error: any) {
    console.error('Error fetching event requests:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch event requests' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  // Content-Security-Policy — deckt die genutzten Fremd-Quellen ab:
  // Supabase (API/Storage/Realtime), Google (Reviews-Fotos, Maps), OpenStreetMap
  // (Leaflet-Tiles + Nominatim), YouTube (Video-Embeds).
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com https://nominatim.openstreetmap.org https://*.tile.openstreetmap.org",
    "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  // HSTS Header (for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

/**
 * Edge-safe verification of the admin session cookie.
 * Verifies the Supabase access token (admin_session) without relying on
 * next/headers, so it can run inside middleware (Edge runtime).
 * Returns true only if the token resolves to a valid Supabase user.
 */
async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    return !error && !!data.user;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth-Gate: jeder /admin/*-Request (außer der Login-Seite) braucht eine
  // gültige Session, sonst Redirect auf /admin/login.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value;
    const isValid = await verifyAdminSession(token);

    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

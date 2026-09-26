import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import crypto from 'crypto'

// Allowed Core Web Vitals metric names (web-vitals library)
const ALLOWED_METRICS = new Set(['LCP', 'CLS', 'FCP', 'INP', 'TTFB', 'FID'])

// POST: Store a single Core Web Vital measurement (anonymized)
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req)
    const rateLimitResponse = checkRateLimit(
      req,
      `vitals-${clientIp}`,
      120,
      60 * 1000
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await req.json()
    const name = String(body?.name || '').toUpperCase()
    const value = Number(body?.value)
    const path = String(body?.path || '')

    if (!ALLOWED_METRICS.has(name)) {
      return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
    }
    if (!Number.isFinite(value) || value < 0 || value > 3_600_000) {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 })
    }
    if (!path || path.length > 200) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Anonymous, non-reversible session hash (IP + UA + day), same scheme as pageviews
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = req.headers.get('user-agent') || ''
    const today = new Date().toISOString().split('T')[0]
    const sessionHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${today}`)
      .digest('hex')
      .substring(0, 16)

    const { error } = await supabaseServer.from('performance_metrics').insert({
      session_hash: sessionHash,
      metric_name: name,
      metric_value: value,
      path: path.substring(0, 200),
    })

    if (error) {
      console.error('Web Vitals tracking error:', error)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Web Vitals error:', error)
    return new NextResponse(null, { status: 204 }) // silent fail
  }
}

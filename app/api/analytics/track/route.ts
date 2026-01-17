import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import crypto from 'crypto'

// POST: Track a page view (anonymized)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, referrer, userAgent } = body

    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 })
    }

    // Generate anonymous session hash from IP + UA + date (changes daily)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown'
    const today = new Date().toISOString().split('T')[0]
    const sessionHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${today}`)
      .digest('hex')
      .substring(0, 16) // Shortened hash, not reversible

    // Detect device type from User-Agent
    const ua = (userAgent || '').toLowerCase()
    let deviceType = 'desktop'
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      deviceType = 'mobile'
    } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
      deviceType = 'tablet'
    }

    // Extract browser name (simplified)
    let browser = 'Other'
    if (ua.includes('firefox')) browser = 'Firefox'
    else if (ua.includes('edg')) browser = 'Edge'
    else if (ua.includes('chrome')) browser = 'Chrome'
    else if (ua.includes('safari')) browser = 'Safari'
    else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera'

    // Clean referrer (remove query params for privacy)
    let cleanReferrer = null
    if (referrer && !referrer.includes('dancemotion.org')) {
      try {
        const refUrl = new URL(referrer)
        cleanReferrer = refUrl.hostname
      } catch {
        cleanReferrer = referrer.substring(0, 100)
      }
    }

    // Insert page view
    const { error } = await supabaseServer
      .from('analytics_pageviews')
      .insert({
        session_hash: sessionHash,
        path: path.substring(0, 200), // Limit path length
        referrer: cleanReferrer,
        device_type: deviceType,
        browser,
      })

    if (error) {
      // Don't expose error to client, just log
      console.error('Analytics tracking error:', error)
    }

    // Return minimal response (for beacon/sendBeacon compatibility)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Analytics error:', error)
    return new NextResponse(null, { status: 204 }) // Silent fail
  }
}

import { supabaseServer } from '@/lib/supabase'

/**
 * Public Content API - Read only, no authentication required
 * Only returns specific public content like footer information
 * 
 * GET /api/content?keys=footer_email,footer_phone,footer_location
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const keysParam = searchParams.get('keys')
    
    // Only allow specific public keys to be fetched
    const allowedPublicKeys = [
      'footer_email',
      'footer_phone', 
      'footer_location',
      'footer.contact.email',
      'footer.contact.phone',
      'footer.contact.address',
      'hero.background_image_url',
      'groups.banner_image_url',
    ]

    let keysToFetch = allowedPublicKeys
    
    if (keysParam) {
      const requestedKeys = keysParam.split(',').map(k => k.trim())

      // Explicitly block any settings-like keys in public API
      if (requestedKeys.some(k => k.toLowerCase().startsWith('settings') || k.toLowerCase().includes('system_setting'))) {
        return Response.json({ error: 'Forbidden key requested' }, { status: 403 })
      }

      // Filter to only allowed keys
      keysToFetch = requestedKeys.filter(k => allowedPublicKeys.includes(k))
    }

    if (keysToFetch.length === 0) {
      return Response.json({ error: 'No valid keys requested' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('content')
      .select('key, value, section')
      .in('key', keysToFetch)

    if (error) throw error

    // Return as key-value map for easy consumption
    const result: Record<string, any> = {}
    data?.forEach(item => {
      result[item.key] = item.value?.text || item.value || ''
    })

    return Response.json({ 
      success: true,
      data: result 
    })
  } catch (error: any) {
    console.error('Public content API error:', error)
    return Response.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

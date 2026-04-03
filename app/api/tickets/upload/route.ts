import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getClientIp, rateLimit } from '@/lib/rate-limiter'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// POST - Anonymous ticket image upload (no auth required)
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const rl = rateLimit(`tickets:upload:${clientIp}`, 10, 60 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
    }

    const mimeType = (file.type || '').toLowerCase()
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Ungültiges Dateiformat. Erlaubt: JPG, PNG, WEBP, GIF' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Datei zu groß (max. 5MB)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `ticket-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `tickets/${fileName}`

    const { error: uploadError } = await supabaseServer.storage
      .from('images')
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabaseServer.storage
      .from('images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      path: filePath,
    })
  } catch (error: any) {
    console.error('Ticket image upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload fehlgeschlagen' }, { status: 500 })
  }
}

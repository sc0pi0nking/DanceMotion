import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// POST - Anonymous ticket image upload (no auth required)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
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
        contentType: file.type,
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

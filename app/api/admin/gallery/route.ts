import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - All galleries
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error: any) {
    console.error('GET /api/admin/gallery error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create gallery with images
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const category = formData.get('category') as string || 'general'
    const description = formData.get('description') as string || ''
    const is_published = formData.get('is_published') === 'true'
    const imageFiles = formData.getAll('images') as File[]

    if (!title || imageFiles.length === 0) {
      return Response.json(
        { error: 'Titel und Bilder sind erforderlich' },
        { status: 400 }
      )
    }

    // Upload images to Supabase Storage
    const imageUrls: string[] = []
    
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      imageUrls.push(publicUrl)
    }

    // Create gallery entry
    const { data, error } = await supabaseServer
      .from('gallery')
      .insert([{
        title,
        category,
        description,
        images: imageUrls,
        is_published,
      }])
      .select()

    if (error) throw error

    return Response.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/gallery error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

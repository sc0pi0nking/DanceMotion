import { supabaseServer } from '@/lib/supabase'
import { revalidateTag } from 'next/cache'
import type { Event } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// GET - Fetch single event
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update event
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const event: Partial<Event> = await req.json()

    // Fix: Convert empty time string to null
    if (event.time === '') {
      event.time = null as any
    }

    const { data, error } = await supabaseServer
      .from('events')
      .update({
        ...event,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    revalidateTag('events', 'max')
    return Response.json(data[0])
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove event
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.EVENTS)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { error } = await supabaseServer
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidateTag('events', 'max')
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

import { supabaseServer } from '@/lib/supabase'

// PATCH - Update ticket status or add note
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { action, status, note } = body

    // TODO: Verify admin permission with tickets_admin

    if (action === 'update_status') {
      const { data, error } = await supabaseServer
        .from('tickets')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    if (action === 'add_note') {
      if (!note) {
        return Response.json(
          { error: 'Notiz erforderlich' },
          { status: 400 }
        )
      }

      const { data: ticket, error: fetchError } = await supabaseServer
        .from('tickets')
        .select('admin_notes')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      const adminNotes = Array.isArray(ticket.admin_notes) ? ticket.admin_notes : []
      const updatedNotes = [
        ...adminNotes,
        {
          note,
          created_by: 'Admin', // TODO: Get actual admin name from session
          created_at: new Date().toISOString(),
        },
      ]

      const { data, error } = await supabaseServer
        .from('tickets')
        .update({
          admin_notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    return Response.json(
      { error: 'Ungültige Aktion' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('PATCH /api/admin/tickets/[id] error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove ticket
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Verify admin permission with tickets_admin

    const { error } = await supabaseServer
      .from('tickets')
      .delete()
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/admin/tickets/[id] error:', error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

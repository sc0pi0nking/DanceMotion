import { requirePermission, PERMISSIONS } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'

// DELETE - Remove alert
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.ALERTS_ADMIN)

    const { id } = await params
    const { error } = await supabaseServer
      .from('system_alerts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error: any) {
    if (error?.message?.startsWith?.('Unauthorized')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error?.message?.startsWith?.('Forbidden')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

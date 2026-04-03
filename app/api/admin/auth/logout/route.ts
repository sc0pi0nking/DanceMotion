import { cookies } from 'next/headers'
import { requirePermission, PERMISSIONS } from '@/lib/auth'

export async function POST() {
  try {
    await requirePermission(PERMISSIONS.DASHBOARD)

    const cookieStore = await cookies()
    cookieStore.delete('admin_session')

    return Response.json({ success: true })
  } catch (error: any) {
    if (error?.message?.startsWith?.('Unauthorized')) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (error?.message?.startsWith?.('Forbidden')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json({ error: error.message }, { status: 500 })
  }
}

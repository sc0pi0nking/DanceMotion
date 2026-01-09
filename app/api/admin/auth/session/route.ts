import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAdminSession()

    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return Response.json({ user })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

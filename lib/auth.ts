import { cookies } from 'next/headers'
import { supabaseServer } from './supabase'

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (!token) {
      return null
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(token)

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  PERMISSIONS: { DASHBOARD: 'dashboard' },
  requirePermission: vi.fn(async () => {
    throw new Error('Forbidden: Missing permission')
  }),
}))

vi.mock('@/lib/settings', () => ({
  getSystemSettings: vi.fn(async () => ({ session_timeout_minutes: 30 })),
}))

vi.mock('@/lib/supabase', () => ({
  supabaseServer: {
    from: vi.fn(),
  },
}))

describe('Admin session endpoint hardening', () => {
  it('returns 403 when no active authorized admin is available', async () => {
    const { GET } = await import('@/app/api/admin/auth/session/route')
    const res = await GET()

    expect(res.status).toBe(403)
  })
})

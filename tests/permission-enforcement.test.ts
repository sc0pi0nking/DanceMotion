import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  PERMISSIONS: { TICKETS_ADMIN: 'tickets_admin' },
  requirePermission: vi.fn(async () => {
    throw new Error("Forbidden: Missing permission 'tickets_admin'")
  }),
}))

vi.mock('@/lib/supabase', () => ({
  supabaseServer: {
    from: vi.fn(),
  },
}))

describe('Admin permission enforcement', () => {
  it('admin tickets endpoint returns 403 when permission is missing', async () => {
    const { GET } = await import('@/app/api/admin/tickets/route')
    const res = await GET()

    expect(res.status).toBe(403)
  })
})

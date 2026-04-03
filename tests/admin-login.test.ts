import { describe, it, expect, vi, beforeEach } from 'vitest'

const cookieSet = vi.fn()

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    set: cookieSet,
    delete: vi.fn(),
    get: vi.fn(),
  })),
}))

const logLoginAction = vi.fn()
vi.mock('@/lib/audit-logger', () => ({
  logLoginAction,
}))

const signInWithPassword = vi.fn()
const signOut = vi.fn()
const maybeSingle = vi.fn()
const updateEq = vi.fn()
const update = vi.fn(() => ({ eq: updateEq }))

const from = vi.fn(() => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      maybeSingle,
    })),
  })),
  update,
}))

vi.mock('@/lib/supabase', () => ({
  supabaseServer: {
    auth: {
      signInWithPassword,
      signOut,
    },
    from,
  },
}))

describe('Admin login hardening', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 403 and does not set cookie when admin_users entry is missing', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        user: { id: 'user-1', email: 'x@example.com' },
        session: { access_token: 'token-123' },
      },
      error: null,
    })
    maybeSingle.mockResolvedValue({ data: null, error: null })

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const req = new Request('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'x@example.com', password: 'Secret123!' }),
    }) as any

    const res = await POST(req)

    expect(res.status).toBe(403)
    expect(signOut).toHaveBeenCalledTimes(1)
    expect(cookieSet).not.toHaveBeenCalled()
  })
})

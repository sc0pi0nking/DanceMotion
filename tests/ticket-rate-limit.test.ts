import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resetRateLimitStore } from '@/lib/rate-limiter'

const select = vi.fn(async () => ({ data: [{ id: 'ticket-1' }], error: null }))
const insert = vi.fn(() => ({ select }))

vi.mock('@/lib/supabase', () => ({
  supabaseServer: {
    from: vi.fn(() => ({
      insert,
    })),
  },
}))

describe('Ticket endpoint rate limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRateLimitStore()
  })

  it('returns 429 on the 6th ticket request within one hour from same IP', async () => {
    const { POST } = await import('@/app/api/tickets/route')

    const createReq = () =>
      new Request('http://localhost/api/tickets', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '203.0.113.10',
        },
        body: JSON.stringify({
          title: 'Test',
          description: 'Desc',
          category: 'general',
        }),
      })

    for (let i = 0; i < 5; i++) {
      const okRes = await POST(createReq())
      expect(okRes.status).toBe(201)
    }

    const blocked = await POST(createReq())
    expect(blocked.status).toBe(429)
  })
})

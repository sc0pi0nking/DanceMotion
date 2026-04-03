import { describe, it, expect, vi, beforeEach } from 'vitest'

const eq = vi.fn()
const lte = vi.fn()
const gt = vi.fn()
const order = vi.fn()

const chain: any = {
  eq,
  lte,
  gt,
  order,
  data: [],
  error: null,
}

eq.mockReturnValue(chain)
lte.mockReturnValue(chain)
gt.mockReturnValue(chain)
order.mockReturnValue(chain)

vi.mock('@/lib/supabase', () => ({
  supabaseServer: {
    from: vi.fn(() => ({
      select: vi.fn(() => chain),
    })),
  },
}))

describe('Public alerts filter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    eq.mockReturnValue(chain)
    lte.mockReturnValue(chain)
    gt.mockReturnValue(chain)
    order.mockReturnValue(chain)
  })

  it('enforces non-admin visibility and active date window', async () => {
    const { GET } = await import('@/app/api/alerts/route')
    const res = await GET()

    expect(res.status).toBe(200)
    expect(eq).toHaveBeenCalledWith('visible_to_admins_only', false)
    expect(lte).toHaveBeenCalledWith('start_date', expect.any(String))
    expect(gt).toHaveBeenCalledWith('end_date', expect.any(String))
  })
})

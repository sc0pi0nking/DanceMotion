import { getGoogleReviews } from '@/lib/google-reviews'

export const runtime = 'nodejs'
// Cached inside getGoogleReviews (6h). Route stays lightweight.
export const revalidate = 21600

// GET - Public: returns aggregated Google reviews (cached, safe fields only).
export async function GET() {
  try {
    const data = await getGoogleReviews()
    return Response.json(data)
  } catch (error) {
    console.error('GET /api/reviews error:', error)
    return Response.json(
      { rating: null, total: null, reviews: [], placeUrl: null, configured: false },
      { status: 200 }
    )
  }
}

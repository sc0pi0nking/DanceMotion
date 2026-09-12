import { unstable_cache } from 'next/cache'

/**
 * Google Reviews (Places API) integration.
 *
 * Required environment variables (server-side only, never exposed to client):
 *   GOOGLE_PLACES_API_KEY  – API key with "Places API" enabled + billing.
 *   GOOGLE_PLACE_ID        – The Place ID of the DanceMotion location.
 *
 * If either variable is missing the helpers degrade gracefully and return an
 * empty result set, so the site keeps working without the integration.
 *
 * Note: the Google Places Details endpoint returns at most 5 reviews.
 */

export interface GoogleReview {
  author_name: string
  author_url: string | null
  profile_photo_url: string | null
  rating: number
  relative_time_description: string
  text: string
  time: number
}

export interface GoogleReviewsData {
  rating: number | null
  total: number | null
  reviews: GoogleReview[]
  placeUrl: string | null
  configured: boolean
}

const EMPTY: GoogleReviewsData = {
  rating: null,
  total: null,
  reviews: [],
  placeUrl: null,
  configured: false,
}

// 6 hours – Google reviews change slowly and API calls are billed.
const REVALIDATE_SECONDS = 6 * 60 * 60

function normalizeReview(raw: unknown): GoogleReview | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const text = typeof r.text === 'string' ? r.text.trim() : ''
  const rating = typeof r.rating === 'number' ? r.rating : 0
  const author = typeof r.author_name === 'string' ? r.author_name : 'Google-Nutzer'
  if (!text) return null
  return {
    author_name: author,
    author_url: typeof r.author_url === 'string' ? r.author_url : null,
    profile_photo_url: typeof r.profile_photo_url === 'string' ? r.profile_photo_url : null,
    rating,
    relative_time_description:
      typeof r.relative_time_description === 'string' ? r.relative_time_description : '',
    text,
    time: typeof r.time === 'number' ? r.time : 0,
  }
}

async function fetchFromGoogle(): Promise<GoogleReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return EMPTY
  }

  const fields = 'rating,user_ratings_total,reviews,url'
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${fields}` +
    `&language=de` +
    `&reviews_sort=newest` +
    `&reviews_no_translations=false` +
    `&key=${encodeURIComponent(apiKey)}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      console.error('Google Reviews: HTTP', res.status)
      return { ...EMPTY, configured: true }
    }

    const json = (await res.json()) as {
      status?: string
      error_message?: string
      result?: Record<string, unknown>
    }

    if (json.status !== 'OK' || !json.result) {
      console.error('Google Reviews: status', json.status, json.error_message ?? '')
      return { ...EMPTY, configured: true }
    }

    const result = json.result
    const reviews = Array.isArray(result.reviews)
      ? (result.reviews as unknown[])
          .map(normalizeReview)
          .filter((r): r is GoogleReview => r !== null)
      : []

    return {
      rating: typeof result.rating === 'number' ? result.rating : null,
      total: typeof result.user_ratings_total === 'number' ? result.user_ratings_total : null,
      reviews,
      placeUrl: typeof result.url === 'string' ? result.url : null,
      configured: true,
    }
  } catch (err) {
    console.error('Google Reviews: fetch failed', err)
    return { ...EMPTY, configured: true }
  }
}

/**
 * Cached accessor for the Google reviews. Safe to call from Server Components
 * and route handlers. Cache is tagged 'google-reviews' for on-demand
 * revalidation.
 */
export const getGoogleReviews = unstable_cache(fetchFromGoogle, ['google-reviews'], {
  revalidate: REVALIDATE_SECONDS,
  tags: ['google-reviews'],
})

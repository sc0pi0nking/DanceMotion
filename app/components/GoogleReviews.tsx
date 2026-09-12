import type { GoogleReviewsData } from '@/lib/google-reviews'

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span className="dm-rev-stars" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={i <= full ? 'on' : 'off'}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

/**
 * Google reviews section. Server component — receives already-fetched data.
 * Renders nothing when the integration is not configured or has no reviews,
 * so it is safe to always place in the page.
 */
export default function GoogleReviews({ data }: { data: GoogleReviewsData }) {
  if (!data.configured || data.reviews.length === 0) {
    return null
  }

  return (
    <section id="reviews" className="dm-wrap dm-reviews">
      <div className="dm-reviews-head">
        <div>
          <p className="dm-eyebrow">Das sagen andere</p>
          <h2 className="dm-title" style={{ marginBottom: 0 }}>
            Echte Stimmen von <span className="dm-gt">Google</span>
          </h2>
        </div>

        {data.rating !== null && (
          <div className="dm-reviews-agg">
            <span className="dm-reviews-score">{data.rating.toFixed(1)}</span>
            <Stars rating={data.rating} />
            {data.total !== null && (
              <span className="dm-reviews-count">{data.total} Rezensionen</span>
            )}
          </div>
        )}
      </div>

      <div className="dm-reviews-grid">
        {data.reviews.map((review, i) => (
          <article key={`${review.author_name}-${review.time}-${i}`} className="dm-review-card">
            <header className="dm-review-top">
              {review.profile_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.profile_photo_url}
                  alt=""
                  className="dm-review-avatar"
                  width={44}
                  height={44}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="dm-review-avatar dm-review-avatar-fallback" aria-hidden="true">
                  {review.author_name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="dm-review-meta">
                <span className="dm-review-author">{review.author_name}</span>
                <span className="dm-review-time">{review.relative_time_description}</span>
              </div>
              <svg className="dm-review-glogo" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
                />
              </svg>
            </header>

            <Stars rating={review.rating} />

            <p className="dm-review-text">{review.text}</p>
          </article>
        ))}
      </div>

      {data.placeUrl && (
        <div className="dm-reviews-cta">
          <a
            href={data.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dm-btn-ghost dm-btn-sm"
          >
            Alle Rezensionen auf Google ansehen →
          </a>
        </div>
      )}
    </section>
  )
}

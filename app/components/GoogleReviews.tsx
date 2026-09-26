'use client';

import { useEffect, useState } from 'react';
import type { GoogleReviewsData, GoogleReview } from '@/lib/google-reviews';
import { LinkButton } from './Button';

// Public Google business review deep-link (safe to expose).
const GOOGLE_REVIEW_URL = 'https://g.page/r/CVuMezgHbC0kEBM/review';

function GoogleGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
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
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} von 5 Sternen`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill={i <= full ? '#FBBC05' : 'var(--border)'}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

const EMPTY: GoogleReviewsData = {
  rating: null,
  total: null,
  reviews: [],
  placeUrl: null,
  configured: false,
};

/**
 * Google reviews section for the homepage.
 *
 * Fetches /api/reviews client-side. When the Places API is configured and
 * returns reviews, the live reviews are shown. Otherwise a compact
 * call-to-action is rendered (using the public Google review link), so the
 * homepage always features a Google touchpoint.
 */
export default function GoogleReviews() {
  const [data, setData] = useState<GoogleReviewsData>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : EMPTY))
      .then((json: GoogleReviewsData) => {
        if (!cancelled && json) setData(json);
      })
      .catch(() => {
        /* silent fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasLiveReviews = data.configured && data.reviews.length > 0;
  const profileUrl = data.placeUrl || GOOGLE_REVIEW_URL;

  return (
    <section
      id="reviews"
      className="mx-auto max-w-6xl px-6 py-20 sm:py-24 relative z-20"
    >
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1"
            style={{ backgroundColor: 'var(--badge-bg-subtle)' }}
          >
            <GoogleGlyph size={16} />
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              Das sagen andere
            </span>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>
            {hasLiveReviews
              ? 'Echte Stimmen von Google'
              : 'Bewerte uns auf Google'}
          </h2>
          <p className="mt-3 text-lg" style={{ color: 'var(--muted)' }}>
            {hasLiveReviews
              ? 'Was unsere Community über DanceMotion sagt.'
              : 'Warst du schon bei uns? Deine Google-Rezension hilft anderen, uns zu finden.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasLiveReviews && data.rating !== null ? (
            <>
              <span
                className="text-3xl font-bold"
                style={{ color: 'var(--fg)' }}
              >
                {data.rating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <Stars rating={data.rating} />
                {data.total !== null && (
                  <span
                    className="mt-1 text-xs"
                    style={{ color: 'var(--muted)' }}
                  >
                    {data.total} Rezensionen
                  </span>
                )}
              </div>
            </>
          ) : (
            <Stars rating={5} />
          )}
        </div>
      </div>

      {hasLiveReviews ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((review: GoogleReview, i: number) => (
              <article
                key={`${review.author_name}-${review.time}-${i}`}
                className="flex flex-col gap-3 rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--panel)',
                  border: '1px solid var(--border)',
                }}
              >
                <header className="flex items-center gap-3">
                  {review.profile_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.profile_photo_url}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                      width={44}
                      height={44}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold"
                      style={{
                        backgroundColor: 'var(--badge-bg-subtle)',
                        color: 'var(--accent)',
                      }}
                      aria-hidden="true"
                    >
                      {review.author_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="flex flex-1 flex-col">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {review.author_name}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--muted)' }}
                    >
                      {review.relative_time_description}
                    </span>
                  </div>
                  <GoogleGlyph size={18} />
                </header>

                <Stars rating={review.rating} />

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {review.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <LinkButton
              href={profileUrl}
              variant="secondary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alle Rezensionen auf Google ansehen →
            </LinkButton>
          </div>
        </>
      ) : (
        <div className="text-center">
          <LinkButton
            href={GOOGLE_REVIEW_URL}
            variant="primary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoogleGlyph size={20} />
            Auf Google bewerten
          </LinkButton>
        </div>
      )}
    </section>
  );
}

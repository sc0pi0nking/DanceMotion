import { Metadata } from 'next';
import Link from 'next/link';
import SponsorsGrid from '@/app/components/SponsorsGrid';

export const metadata: Metadata = {
  title: 'Unsere Sponsoren | DanceMotion Eschweiler',
  description: 'Unternehmen und Partner, die DanceMotion Eschweiler unterstützen',
  alternates: {
    canonical: '/sponsor',
  },
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10 md:space-y-14">
        {/* Hero / Intro */}
        <section
          className="relative overflow-hidden rounded-3xl border px-6 py-10 md:px-10 md:py-14"
          style={{
            backgroundColor: 'var(--panel)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 10% 15%, rgba(46,196,198,0.14), transparent 45%), radial-gradient(circle at 90% 80%, rgba(46,196,198,0.10), transparent 40%)',
            }}
          />

          <div className="relative text-center max-w-3xl mx-auto">
            <span
              className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold mb-4"
              style={{
                color: 'var(--accent)',
                borderColor: 'rgba(46,196,198,0.35)',
                backgroundColor: 'rgba(46,196,198,0.08)',
              }}
            >
              Gemeinsam für den Tanz
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Unsere Sponsoren & Partner
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--body-text, var(--muted))' }}>
              Wir danken allen Unternehmen und Partnern, die DanceMotion Eschweiler unterstützen
              und es uns ermöglichen, unsere Leidenschaft für den Tanz zu leben.
            </p>
          </div>
        </section>

        {/* Sponsors Grid */}
        <SponsorsGrid />

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div
            className="rounded-2xl p-8 md:p-12 max-w-3xl mx-auto border"
            style={{
              backgroundColor: 'var(--panel)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Du möchtest DanceMotion unterstützen?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--body-text, var(--muted))' }}>
              Kontaktiere uns für Sponsoring- oder Partnermöglichkeiten.
              Gemeinsam können wir noch mehr erreichen!
            </p>
            <Link
              href="/formulare"
              aria-label="Zum Kontaktformular für Sponsoring- oder Partnermöglichkeiten"
              className="inline-block px-8 py-3 text-white rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 8px 18px rgba(46,196,198,0.24)',
              }}
            >
              Jetzt kontaktieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

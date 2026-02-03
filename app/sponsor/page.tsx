import { Metadata } from 'next';
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
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--fg)" }}>
            Unsere Sponsoren & Partner
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--body-text, var(--muted))" }}>
            Wir danken allen Unternehmen und Partnern, die DanceMotion Eschweiler unterstützen
            und es uns ermöglichen, unsere Leidenschaft für den Tanz zu leben.
          </p>
        </div>

        {/* Sponsors Grid */}
        <SponsorsGrid />

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div 
            className="backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-3xl mx-auto"
            style={{ 
              backgroundColor: "var(--panel)", 
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)"
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--fg)" }}>
              Du möchtest DanceMotion unterstützen?
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--body-text, var(--muted))" }}>
              Kontaktiere uns für Sponsoring- oder Partnermöglichkeiten. 
              Gemeinsam können wir noch mehr erreichen!
            </p>
            <a
              href="/formulare"
              className="inline-block px-8 py-3 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Jetzt kontaktieren
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

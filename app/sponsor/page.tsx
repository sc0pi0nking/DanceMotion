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
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Unsere Sponsoren
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Wir danken unseren Partnern und Sponsoren, die DanceMotion Eschweiler unterstützen 
            und es uns ermöglichen, qualitativ hochwertigen Tanzunterricht und Events zu bieten.
          </p>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <SponsorsGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 md:px-8 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Du möchtest DanceMotion unterstützen?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Kontaktiere uns für Sponsoring- oder Partnermöglichkeiten. Gemeinsam können wir 
            noch mehr erreichen!
          </p>
          <a
            href="/kontakt"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 font-semibold transition-opacity"
          >
            Jetzt kontaktieren
          </a>
        </div>
      </section>
    </div>
  );
}

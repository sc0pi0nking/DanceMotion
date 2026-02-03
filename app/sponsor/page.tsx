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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Unsere Sponsoren & Partner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Wir danken allen Unternehmen und Partnern, die DanceMotion Eschweiler unterstützen
            und es uns ermöglichen, unsere Leidenschaft für den Tanz zu leben.
          </p>
        </div>

        {/* Sponsors Grid */}
        <SponsorsGrid />

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Du möchtest DanceMotion unterstützen?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Kontaktiere uns für Sponsoring- oder Partnermöglichkeiten. 
              Gemeinsam können wir noch mehr erreichen!
            </p>
            <a
              href="/formulare"
              className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
            >
              Jetzt kontaktieren
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

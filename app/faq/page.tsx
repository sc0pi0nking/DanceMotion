import Link from 'next/link';
import FAQAccordion from '@/app/components/FAQAccordion';

export const metadata = {
  title: 'Häufig gestellte Fragen — DanceMotion Eschweiler',
  description: 'Antworten auf häufig gestellte Fragen zu unseren Tanzkursen, Anmeldung, Events und mehr.',
};

async function getFAQs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/faqs`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        <span>←</span> Zurück zur Startseite
      </Link>

      <div className="mt-8 mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: 'var(--fg)' }}
        >
          Häufig gestellte Fragen
        </h1>
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Hier finden Sie Antworten auf die wichtigsten Fragen zu DanceMotion Eschweiler.
          Sollte Ihre Frage nicht dabei sein, kontaktieren Sie uns gerne!
        </p>
      </div>

      {faqs.length > 0 ? (
        <FAQAccordion faqs={faqs} />
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Derzeit sind keine FAQs verfügbar. Schauen Sie bald wieder vorbei!
          </p>
        </div>
      )}

      {/* Kontakt CTA */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Noch Fragen?</h2>
        <p className="mb-4">Wir helfen Ihnen gerne weiter!</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:info@dancemotion-eschweiler.de"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            E-Mail senden
          </a>
          <a
            href="tel:02403555444"
            className="px-6 py-3 bg-white/20 backdrop-blur font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            02403 555444
          </a>
        </div>
      </div>
    </div>
  );
}

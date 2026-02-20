import Link from 'next/link';
import FAQAccordion from '@/app/components/FAQAccordion';
import { supabaseServer } from '@/lib/supabase';

export const metadata = {
  title: 'Häufig gestellte Fragen — DanceMotion Eschweiler',
  description: 'Antworten auf häufig gestellte Fragen zu unseren Tanzkursen, Anmeldung, Events und mehr.',
};

export const revalidate = 3600;

async function getFAQs() {
  try {
    const { data, error } = await supabaseServer
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      // Graceful fallback during build or when DB is unreachable
      if (process.env.NODE_ENV === 'production') {
        console.error('Error fetching FAQs:', error.message);
      }
      return [];
    }

    return data || [];
  } catch {
    // Silent fallback - FAQs will load on next ISR revalidation
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
        <div 
          className="text-center py-12 rounded-lg shadow-lg"
          style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}
        >
          <p style={{ color: "var(--muted)" }}>
            Derzeit sind keine FAQs verfügbar. Schauen Sie bald wieder vorbei!
          </p>
        </div>
      )}

      {/* Kontakt CTA */}
      <div className="mt-12 p-8 rounded-2xl text-center" style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--fg)" }}>Noch Fragen?</h2>
        <p className="mb-6" style={{ color: "var(--muted)" }}>Wir helfen Ihnen gerne weiter!</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:info@dancemotion-eschweiler.de"
            className="px-6 py-3 font-semibold rounded-full transition-all duration-300"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            E-Mail senden
          </a>
          <a
            href="tel:02403555444"
            className="px-6 py-3 font-semibold rounded-full transition-all duration-300"
            style={{
              backgroundColor: "rgba(46,196,198,0.1)",
              color: "var(--accent)",
              border: "1px solid rgba(46,196,198,0.3)",
            }}
          >
            02403 555444
          </a>
        </div>
      </div>
    </div>
  );
}

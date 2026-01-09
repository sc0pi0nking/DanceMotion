import Link from "next/link";

export const metadata = {
  title: "Little Joys — DanceMotion Eschweiler",
  description: "Tanzen für die Kleinsten: spielerisch, voller Freude und Bewegung.",
};

export default function LittleJoysPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Little Joys</h1>
      <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
        Tanzen für die Kleinsten — spielerisch und mit viel Freude.
      </p>
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Little Joys ist für Kinder, die Freude an Bewegung und Musik haben. Hier geht es um spielerisches Tanzen, 
            Entdecken und Spaß miteinander.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Was erwartet dich?</h2>
          <ul style={{ color: "var(--muted)" }} className="list-disc list-inside space-y-2">
            <li>Spielerische Choreografien zu Musik</li>
            <li>Bewegungsfreiheit und Ausdruck fördern</li>
            <li>Gemeinschaft und Freundschaften</li>
            <li>Rhythmus und Koordination entwickeln</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Anmeldung</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Interessiert? Schreib uns eine Nachricht oder komm vorbei — wir freuen uns auf dich!
          </p>
          <a 
            href="mailto:info@dancemotion-eschweiler.de"
            className="inline-block mt-4 px-6 py-3 rounded-full font-semibold"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            Jetzt Kontakt aufnehmen
          </a>
        </section>
      </div>
    </div>
  );
}

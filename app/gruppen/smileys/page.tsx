import Link from "next/link";

export const metadata = {
  title: "Smileys — DanceMotion Eschweiler",
  description: "Fröhliche Tanzgruppe für Kinder mit Bewegung und Musik.",
};

export default function SmileysPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Smileys</h1>
      <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
        Fröhliche Gruppe für Kinder mit Bewegung und Musik.
      </p>
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Smileys richtet sich an Kinder, die Freude am Tanzen und an der Gemeinschaft haben. 
            Hier dreht es sich um Spaß, Energie und positive Vibes!
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Was erwartet dich?</h2>
          <ul style={{ color: "var(--muted)" }} className="list-disc list-inside space-y-2">
            <li>Moderne, fröhliche Choreografien</li>
            <li>Kreative Ausdrucksformen</li>
            <li>Teamgeist und positive Atmosphäre</li>
            <li>Performances und gemeinsame Events</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Anmeldung</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Neugierig geworden? Komm zu unserem nächsten Treffen oder schreib uns!
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

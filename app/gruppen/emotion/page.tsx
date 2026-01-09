import Link from "next/link";

export const metadata = {
  title: "Emotion — DanceMotion Eschweiler",
  description: "Ausdrucksstarker Tanz für Jugendliche und Erwachsene.",
};

export default function EmotionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Emotion</h1>
      <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
        Ausdrucksstarker Tanz für Jugendliche und Erwachsene.
      </p>
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Emotion ist für dich, wenn du deinen eigenen Ausdruck finden möchtest. Wir tanzen nicht nur Choreografien — 
            wir bringen Gefühle zum Ausdruck und erkunden unsere Persönlichkeit durch Bewegung.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Was erwartet dich?</h2>
          <ul style={{ color: "var(--muted)" }} className="list-disc list-inside space-y-2">
            <li>Contemporary & Modern Dance</li>
            <li>Persönlicher künstlerischer Ausdruck</li>
            <li>Intensive Trainingssessions</li>
            <li>Auftritte und künstlerische Projekte</li>
            <li>Eine unterstützende Community</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Anmeldung</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Bereit, deine Kreativität auszudrücken? Komm mit zu uns!
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

import Link from "next/link";
import EditableContent from "@/app/components/EditableContent";

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
      
      {/* Logo */}
      <div className="mt-8 mb-8 flex justify-center">
        <img 
          src="/logos/emotion.svg" 
          alt="Emotion Logo" 
          className="h-32 w-32 object-contain"
        />
      </div>
      
      <h1 className="text-4xl font-bold text-center" style={{ color: "var(--fg)" }}>Emotion</h1>
      <EditableContent
        contentKey="emotion.subtitle"
        defaultValue="Ausdrucksstarker Tanz für Jugendliche und Erwachsene."
        className="mt-4 text-lg text-center"
        style={{ color: "var(--muted)" }}
      />
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <EditableContent
            contentKey="emotion.for_whom"
            defaultValue="Emotion ist für dich, wenn du deinen eigenen Ausdruck finden möchtest. Wir tanzen nicht nur Choreografien — wir bringen Gefühle zum Ausdruck und erkunden unsere Persönlichkeit durch Bewegung."
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Was erwartet dich?</h2>
          <EditableContent
            contentKey="emotion.what_to_expect"
            defaultValue="• Contemporary & Modern Dance
• Persönlicher künstlerischer Ausdruck
• Intensive Trainingssessions
• Auftritte und künstlerische Projekte
• Eine unterstützende Community"
            className="leading-relaxed whitespace-pre-line"
            style={{ color: "var(--muted)" }}
            multiline
            as="div"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Anmeldung</h2>
          <EditableContent
            contentKey="emotion.contact_text"
            defaultValue="Bereit, deine Kreativität auszudrücken? Komm mit zu uns!"
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
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

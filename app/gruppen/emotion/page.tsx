import Link from "next/link";
import Image from "next/image";
import EditableContent from "@/app/components/EditableContent";

export const metadata = {
  title: "Emotion — DanceMotion Eschweiler",
  description: "Ausdrucksstarker Tanz für Jugendliche und Erwachsene.",
};

export default function EmotionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline animated-heading" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      
      {/* Logo with glassmorphism background */}
      <div className="mt-8 mb-8 flex justify-center">
        <div className="glassmorphism p-8 rounded-2xl">
          <Image 
            src="/logos/emotion.png" 
            alt="Emotion Logo" 
            width={128}
            height={128}
            className="h-32 w-32 object-contain mx-auto hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-center animated-heading px-4" style={{ color: "var(--fg)" }}>Emotion</h1>
      <EditableContent
        contentKey="emotion.subtitle"
        defaultValue="Ausdrucksstarker Tanz für Jugendliche und Erwachsene."
        className="mt-6 text-lg text-center"
        style={{ color: "var(--muted)" }}
      />
      
      <div className="mt-16 space-y-12">
        <section className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <EditableContent
            contentKey="emotion.for_whom"
            defaultValue="Emotion ist für dich, wenn du deinen eigenen Ausdruck finden möchtest. Wir tanzen nicht nur Choreografien — wir bringen Gefühle zum Ausdruck und erkunden unsere Persönlichkeit durch Bewegung."
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section className="glass rounded-2xl p-8 md:p-12">
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

        <section className="glass rounded-2xl p-8 md:p-12">
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

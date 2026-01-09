import Link from "next/link";
import EditableContent from "@/app/components/EditableContent";

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
      <EditableContent
        contentKey="smileys.subtitle"
        defaultValue="Fröhliche Gruppe für Kinder mit Bewegung und Musik."
        className="mt-4 text-lg"
        style={{ color: "var(--muted)" }}
      />
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <EditableContent
            contentKey="smileys.for_whom"
            defaultValue="Smileys richtet sich an Kinder, die Freude am Tanzen und an der Gemeinschaft haben. Hier dreht es sich um Spaß, Energie und positive Vibes!"
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Was erwartet dich?</h2>
          <EditableContent
            contentKey="smileys.what_to_expect"
            defaultValue="• Moderne, fröhliche Choreografien
• Kreative Ausdrucksformen
• Teamgeist und positive Atmosphäre
• Performances und gemeinsame Events"
            className="leading-relaxed whitespace-pre-line"
            style={{ color: "var(--muted)" }}
            multiline
            as="div"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Anmeldung</h2>
          <EditableContent
            contentKey="smileys.contact_text"
            defaultValue="Neugierig geworden? Komm zu unserem nächsten Treffen oder schreib uns!"
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

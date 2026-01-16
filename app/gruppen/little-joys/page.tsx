import Link from "next/link";
import Image from "next/image";
import EditableContent from "@/app/components/EditableContent";

export const metadata = {
  title: "Little Joys — DanceMotion Eschweiler",
  description: "Tanzen für die Kleinsten: spielerisch, voller Freude und Bewegung.",
};

export default function LittleJoysPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 relative z-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline animated-heading" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      
      {/* Logo with glassmorphism background */}
      <div className="mt-8 mb-8 flex justify-center">
        <div className="glassmorphism p-8 rounded-2xl">
          <Image 
            src="/logos/litteljoys.png" 
            alt="Little Joys Logo" 
            width={128}
            height={128}
            className="h-32 w-32 object-contain mx-auto hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-center animated-heading px-4" style={{ color: "var(--fg)" }}>Little Joys</h1>
      <EditableContent
        contentKey="little-joys.subtitle"
        defaultValue="Tanzen für die Kleinsten — spielerisch und mit viel Freude."
        className="mt-6 text-lg text-center"
        style={{ color: "var(--muted)" }}
      />
      
      <div className="mt-16 space-y-12">
        <section className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <EditableContent
            contentKey="little-joys.for_whom"
            defaultValue="Little Joys ist für Kinder, die Freude an Bewegung und Musik haben. Hier geht es um spielerisches Tanzen, Entdecken und Spaß miteinander."
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Was erwartet dich?</h2>
          <EditableContent
            contentKey="little-joys.what_to_expect"
            defaultValue="• Spielerische Choreografien zu Musik
• Bewegungsfreiheit und Ausdruck fördern
• Gemeinschaft und Freundschaften
• Rhythmus und Koordination entwickeln"
            className="leading-relaxed whitespace-pre-line"
            style={{ color: "var(--muted)" }}
            multiline
            as="div"
          />
        </section>

        <section className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Anmeldung</h2>
          <EditableContent
            contentKey="little-joys.contact_text"
            defaultValue="Interessiert? Schreib uns eine Nachricht oder komm vorbei — wir freuen uns auf dich!"
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

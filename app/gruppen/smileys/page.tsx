import Link from "next/link";
import Image from "next/image";
import EditableContent from "@/app/components/EditableContent";
import { Clock, MapPin, Calendar } from "lucide-react";

export const metadata = {
  title: "Smileys — DanceMotion Eschweiler",
  description: "Fröhliche Tanzgruppe für Kinder mit Bewegung und Musik.",
};

export default function SmileysPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline animated-heading" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      
      {/* Logo with glassmorphism background */}
      <div className="mt-8 mb-8 flex justify-center">
        <div className="glassmorphism p-8 rounded-2xl">
          <Image 
            src="/logos/smileys.png" 
            alt="Smileys Logo" 
            width={128}
            height={128}
            className="h-32 w-32 object-contain mx-auto hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-center animated-heading px-4" style={{ color: "var(--fg)" }}>Smileys</h1>
      <EditableContent
        contentKey="smileys.subtitle"
        defaultValue="Fröhliche Gruppe für Kinder mit Bewegung und Musik."
        className="mt-6 text-lg text-center"
        style={{ color: "var(--muted)" }}
      />
      
      <div className="mt-16 space-y-12">
        {/* Trainingszeiten Section - Admin-editierbar */}
        <section className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Calendar size={28} />
            <EditableContent
              contentKey="smileys.training_heading"
              defaultValue="Trainingszeiten"
              as="span"
              className="text-2xl font-semibold"
            />
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock size={20} className="mt-1 flex-shrink-0" style={{ opacity: 0.9 }} />
              <div>
                <EditableContent
                  contentKey="smileys.training_times"
                  defaultValue="Dienstags: 16:30 – 17:30 Uhr"
                  className="font-medium whitespace-pre-line"
                  multiline
                  as="div"
                />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-1 flex-shrink-0" style={{ opacity: 0.9 }} />
              <EditableContent
                contentKey="smileys.training_location"
                defaultValue="Turnhalle am Talbahnhof, Eschweiler"
                className="font-medium"
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Für wen?</h2>
          <EditableContent
            contentKey="smileys.for_whom"
            defaultValue="Smileys richtet sich an Kinder, die Freude am Tanzen und an der Gemeinschaft haben. Hier dreht es sich um Spaß, Energie und positive Vibes!"
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section className="glass rounded-2xl p-8 md:p-12">
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

        <section className="glass rounded-2xl p-8 md:p-12">
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

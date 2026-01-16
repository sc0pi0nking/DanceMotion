'use client';

import Link from "next/link";
import EditableContent from '@/app/components/EditableContent';

export default function EventstudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Eventstudio</h1>
      <EditableContent
        contentKey="eventstudio.intro"
        defaultValue="Unser Studio für Events, Kurse und Proben."
        className="mt-4 text-lg"
        style={{ color: "var(--muted)" }}
      />
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Das Studio</h2>
          <EditableContent
            contentKey="eventstudio.studio_description"
            defaultValue="Unser modernes Studio in Eschweiler bietet den perfekten Raum für Tänze, Events, Proben und Kurse. Mit professioneller Ausstattung und einer inspirierenden Atmosphäre."
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Vermietung & Nutzung</h2>
          <EditableContent
            contentKey="eventstudio.rental_options"
            defaultValue="• Stundenvermietung für private Kurse
• Tagsüber oder abends
• Flexible Buchung
• Proberäume für Gruppen
• Event-Hosting"
            className="leading-relaxed whitespace-pre-line"
            style={{ color: "var(--muted)" }}
            multiline
            as="div"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kurse & Workshops</h2>
          <EditableContent
            contentKey="eventstudio.courses_description"
            defaultValue="Wir bieten regelmäßig Kurse in verschiedenen Stilen an — Contemporary, Modern, Hip-Hop und mehr. Anfänger bis Fortgeschrittene willkommen!"
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Buchung</h2>
          <EditableContent
            contentKey="eventstudio.contact_description"
            defaultValue="Interessiert an einer Vermietung oder einem Kurs? Schreiben Sie uns gerne eine Email!"
            className="leading-relaxed mb-4"
            style={{ color: "var(--muted)" }}
            multiline
          />
          <a 
            href="mailto:dance-music-school@web.de"
            className="inline-block px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            📧 dance-music-school@web.de
          </a>
        </section>

        {/* Disclaimer */}
        <section className="mt-16 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
          <EditableContent
            contentKey="eventstudio.disclaimer"
            defaultValue="Disclaimer: Der Verein DanceMotion ist nicht unmittelbar an der Buchung und Vermietung des Eventstudios beteiligt. Wir vermitteln lediglich Interessenten weiter und stellen Informationen zur Verfügung. Die Buchung erfolgt direkt mit dem Studio."
            className="text-xs leading-relaxed"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>
      </div>
    </div>
  );
}

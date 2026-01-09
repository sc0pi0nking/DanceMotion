import Link from "next/link";

export const metadata = {
  title: "Eventstudio — DanceMotion Eschweiler",
  description: "Unser Studio für Vermietung, Kurse, Events und Proben.",
};

export default function EventstudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Eventstudio</h1>
      <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
        Unser Studio für Events, Kurse und Proben.
      </p>
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Das Studio</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Unser modernes Studio in Eschweiler bietet den perfekten Raum für Tänze, Events, Proben und Kurse. 
            Mit professioneller Ausstattung und einer inspirierenden Atmosphäre.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Vermietung & Nutzung</h2>
          <ul style={{ color: "var(--muted)" }} className="list-disc list-inside space-y-2">
            <li>Stundenvermietung für private Kurse</li>
            <li>Tagsüber oder abends</li>
            <li>Flexible Buchung</li>
            <li>Proberäume für Gruppen</li>
            <li>Event-Hosting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kurse & Workshops</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Wir bieten regelmäßig Kurse in verschiedenen Stilen an — Contemporary, Modern, Hip-Hop und mehr.
            Anfänger bis Fortgeschrittene willkommen!
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>Kontakt & Buchung</h2>
          <p style={{ color: "var(--muted)" }} className="leading-relaxed">
            Interessiert an einer Vermietung oder einem Kurs? Wir freuen uns von dir zu hören!
          </p>
          <a 
            href="mailto:info@dancemotion-eschweiler.de"
            className="inline-block mt-4 px-6 py-3 rounded-full font-semibold"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            Jetzt anfragen
          </a>
        </section>
      </div>
    </div>
  );
}

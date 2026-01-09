import Link from "next/link";

export const metadata = {
  title: "Impressum — DanceMotion Eschweiler",
  description: "Impressum und Kontaktinformationen von DanceMotion Eschweiler.",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Impressum</h1>
      
      <div className="mt-12 space-y-6 leading-relaxed" style={{ color: "var(--muted)" }}>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Verantwortlich:</h2>
          <p>DanceMotion Eschweiler<br />
          Verein für Tanz & Bewegung<br />
          Eschweiler, Deutschland</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Kontakt:</h2>
          <p>E-Mail: info@dancemotion-eschweiler.de<br />
          Telefon: +49 (0) XXX XXXXXXX</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Website & Hosting:</h2>
          <p>Entwicklung und Hosting durch DanceMotion Eschweiler</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Haftungshinweis:</h2>
          <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte 
          externer Links. Die Betreiber der verlinkten Seiten sind allein verantwortlich für deren Inhalte.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Urheberrecht:</h2>
          <p>Die Inhalte und Werke dieser Website unterliegen dem deutschen Urheberrecht. 
          Die Vervielfältigung, Bearbeitung, Verbreitung und Nutzung außerhalb der Grenzen des Urheberrechts bedürfen 
          der vorherigen schriftlichen Zustimmung des Autors oder Urhebers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Datenschutz:</h2>
          <p>Informationen zum Datenschutz finden Sie in unserer <Link href="/datenschutz" className="underline" style={{ color: "var(--accent)" }}>Datenschutzerklärung</Link>.</p>
        </section>
      </div>
    </div>
  );
}

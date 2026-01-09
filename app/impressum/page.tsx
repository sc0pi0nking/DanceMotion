import Link from "next/link";
import EditableContent from "@/app/components/EditableContent";

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
          <EditableContent
            contentKey="impressum.responsible"
            defaultValue="DanceMotion Eschweiler
Verein für Tanz & Bewegung
Eschweiler, Deutschland"
            className="whitespace-pre-line"
            style={{ color: "var(--muted)" }}
            multiline
            as="div"
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Kontakt:</h2>
          <EditableContent
            contentKey="impressum.contact"
            defaultValue="E-Mail: info@dancemotion-eschweiler.de
Telefon: +49 (0) XXX XXXXXXX"
            className="whitespace-pre-line"
            style={{ color: "var(--muted)" }}
            multiline
            as="div"
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Website & Hosting:</h2>
          <EditableContent
            contentKey="impressum.hosting"
            defaultValue="Entwicklung und Hosting durch DanceMotion Eschweiler"
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Haftungshinweis:</h2>
          <EditableContent
            contentKey="impressum.liability"
            defaultValue="Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Die Betreiber der verlinkten Seiten sind allein verantwortlich für deren Inhalte."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Urheberrecht:</h2>
          <EditableContent
            contentKey="impressum.copyright"
            defaultValue="Die Inhalte und Werke dieser Website unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und Nutzung außerhalb der Grenzen des Urheberrechts bedürfen der vorherigen schriftlichen Zustimmung des Autors oder Urhebers."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Datenschutz:</h2>
          <p>Informationen zum Datenschutz finden Sie in unserer <Link href="/datenschutz" className="underline" style={{ color: "var(--accent)" }}>Datenschutzerklärung</Link>.</p>
        </section>
      </div>
    </div>
  );
}

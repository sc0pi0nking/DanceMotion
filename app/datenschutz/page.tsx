import Link from "next/link";
import EditableContent from "@/app/components/EditableContent";

export const metadata = {
  title: "Datenschutz — DanceMotion Eschweiler",
  description: "Datenschutzerklärung von DanceMotion Eschweiler.",
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      <h1 className="mt-8 text-4xl font-bold" style={{ color: "var(--fg)" }}>Datenschutzerklärung</h1>
      
      <div className="mt-12 space-y-6 leading-relaxed" style={{ color: "var(--muted)" }}>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Datenschutz</h2>
          <EditableContent
            contentKey="datenschutz.intro"
            defaultValue="Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Erfassung von Daten</h2>
          <EditableContent
            contentKey="datenschutz.data_collection"
            defaultValue="Wenn Sie unsere Website besuchen, werden automatisch Informationen über den Zugriff erfasst (z.B. Datum, Uhrzeit, Browser). Diese Informationen werden zu statistischen Zwecken genutzt."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Kontaktformulare</h2>
          <EditableContent
            contentKey="datenschutz.contact_forms"
            defaultValue="Wenn Sie uns über ein Kontaktformular oder E-Mail eine Nachricht senden, speichern wir Ihre Daten ausschließlich zur Beantwortung Ihrer Anfrage. Wir geben Ihre Daten nicht an Dritte weiter."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Event-Anfragen (DSGVO)</h2>
          <div className="space-y-3" style={{ color: "var(--muted)" }}>
            <p>
              <strong>Rechtsgrundlage:</strong> Die Verarbeitung Ihrer Daten erfolgt auf Basis Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
            <p>
              <strong>Zweck:</strong> Ihre über das Event-Anfrageformular übermittelten Daten (Name, E-Mail, Telefon, Event-Details, Nachricht) 
              werden ausschließlich zur Bearbeitung Ihrer Anfrage und zur Kontaktaufnahme verwendet.
            </p>
            <p>
              <strong>Speicherdauer:</strong> Ihre Daten werden für maximal 90 Tage nach Abschluss (Status: "Abgeschlossen" oder "Abgelehnt") 
              gespeichert. Unbearbeitete Anfragen werden nach 180 Tagen automatisch gelöscht.
            </p>
            <p>
              <strong>Widerruf:</strong> Sie können Ihre Einwilligung jederzeit per E-Mail an{' '}
              <a href="mailto:info@dancemotion-eschweiler.de" className="underline">info@dancemotion-eschweiler.de</a>{' '}
              widerrufen. Ihre Daten werden dann umgehend gelöscht.
            </p>
            <p>
              <strong>Weitergabe:</strong> Ihre Daten werden nicht an Dritte weitergegeben.
            </p>
            <p>
              <strong>Verschlüsselung:</strong> Die Übertragung erfolgt verschlüsselt über HTTPS. Die Speicherung erfolgt in einer 
              gesicherten Datenbank mit Zugriffsbeschränkung.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Cookies</h2>
          <EditableContent
            contentKey="datenschutz.cookies"
            defaultValue="Unsere Website nutzt Cookies für die Theme-Auswahl (hell/dunkel). Diese Cookies werden lokal in Ihrem Browser gespeichert und enthalten keine personenbezogenen Daten."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Ihre Rechte</h2>
          <EditableContent
            contentKey="datenschutz.rights"
            defaultValue="Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Datenportabilität bezüglich Ihrer persönlichen Daten. Kontaktieren Sie uns unter info@dancemotion-eschweiler.de."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>Änderungen dieser Erklärung</h2>
          <EditableContent
            contentKey="datenschutz.changes"
            defaultValue="Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen, um Änderungen der rechtlichen Situation zu berücksichtigen."
            style={{ color: "var(--muted)" }}
            multiline
          />
        </section>
      </div>
    </div>
  );
}

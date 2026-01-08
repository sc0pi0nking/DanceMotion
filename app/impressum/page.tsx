import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Impressum</h1>
      <p className="mt-4" style={{ color: "var(--muted)" }}>Platzhalter: Impressumstext hier einfügen.</p>
      <p className="mt-6">
        <Link href="/">← Zurück zur Startseite</Link>
      </p>
    </div>
  );
}

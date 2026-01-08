import Link from "next/link";

export default function EventstudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Eventstudio</h1>
      <p className="mt-4" style={{ color: "var(--muted)" }}>Platzhalter: Informationen zum Eventstudio, Vermietung und Kurse.</p>
      <p className="mt-6">
        <Link href="/">← Zurück zur Startseite</Link>
      </p>
    </div>
  );
}

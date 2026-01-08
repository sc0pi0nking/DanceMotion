import Link from "next/link";

export default function LittleJoysPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Little Joys</h1>
      <p className="mt-4" style={{ color: "var(--muted)" }}>Platzhalter: Informationen zur Little Joys Gruppe.</p>
      <p className="mt-6">
        <Link href="/">← Zurück zur Startseite</Link>
      </p>
    </div>
  );
}

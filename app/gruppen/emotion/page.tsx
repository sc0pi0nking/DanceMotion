import Link from "next/link";

export default function EmotionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Emotion</h1>
      <p className="mt-4" style={{ color: "var(--muted)" }}>Platzhalter: Informationen zur Emotion Gruppe.</p>
      <p className="mt-6">
        <Link href="/">← Zurück zur Startseite</Link>
      </p>
    </div>
  );
}

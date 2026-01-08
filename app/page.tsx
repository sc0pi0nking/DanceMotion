"use client";
import TileCard from "./components/TileCard";
import { tiles } from "../lib/site-data";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold" style={{ color: "var(--fg)" }}>DanceMotion Eschweiler</h1>
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            Tanzgruppen & Eventstudio — gemeinsam bewegen, ausprobieren und feiern.
          </p>
          <div className="mt-6">
            <a className="inline-block rounded-full px-4 py-2 text-sm btn-accent" href="#groups">
              Unsere Gruppen entdecken
            </a>
          </div>
        </div>
      </section>

      <section id="groups" className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-6 text-2xl font-semibold" style={{ color: "var(--fg)" }}>Gruppen & Angebote</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {tiles.map((t) => (
            <TileCard key={t.slug} tile={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

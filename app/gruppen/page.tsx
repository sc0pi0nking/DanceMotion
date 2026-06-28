import Link from "next/link";
import type { Metadata } from "next";
import { fetchActiveGroups } from "@/lib/groups-db";
import { getGroupPresentation, FALLBACK_GROUPS } from "@/lib/group-presentation";
import "../home.css";

export const metadata: Metadata = {
  title: "Unsere Gruppen",
  description:
    "Drei Tanzgruppen für jedes Alter — von Little Joys über Smileys bis Emotion. Finde deine Gruppe bei DanceMotion Eschweiler.",
};

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default async function GruppenPage() {
  const dbGroups = await fetchActiveGroups();
  const groups = dbGroups.length > 0 ? dbGroups : FALLBACK_GROUPS;

  const cards = groups.map((group) => {
    const presentation = getGroupPresentation(
      group.slug,
      (group as { color?: string }).color ?? null
    );
    return {
      slug: group.slug,
      name: group.name,
      short_desc: group.short_desc ?? "",
      ...presentation,
    };
  });

  return (
    <div className="dm-groups min-h-screen">
      {/* Page Hero */}
      <header className="dm-page-hero">
        <p className="dm-eyebrow">Unsere Gruppen</p>
        <h1>
          Für jeden das <span className="dm-gt">Richtige</span>
        </h1>
        <p>
          Egal ob du gerade erst anfängst oder schon Bühnenluft geschnuppert
          hast — bei einer unserer drei Gruppen bist du genau richtig.
        </p>
      </header>

      {/* Groups Grid */}
      <section className="dm-wrap" style={{ paddingTop: 32 }}>
        <div className="dm-groups-grid">
          {cards.map((group) => (
            <Link
              key={group.slug}
              href={`/gruppen/${group.slug}`}
              className="dm-group-card"
              style={{ ["--group" as string]: group.color }}
            >
              <span className="dm-glow" />
              <div className="dm-group-top">
                <span style={{ fontSize: 40 }}>{group.icon}</span>
                <span className="dm-badge-age">
                  <span className="dot" />
                  {group.age}
                </span>
              </div>
              <h2>{group.name}</h2>
              <p className="dm-group-desc">{group.short_desc}</p>
              <div className="dm-group-meta">
                <div className="dm-meta-row">
                  <span className="dm-meta-icon">
                    <ClockIcon />
                  </span>
                  {group.schedule}
                </div>
                <div className="dm-meta-row">
                  <span className="dm-meta-icon">
                    <MapPinIcon />
                  </span>
                  {group.location}
                </div>
                <div className="dm-meta-row">
                  <span className="dm-meta-icon">
                    <UsersIcon />
                  </span>
                  {group.age}
                </div>
              </div>
              <div className="dm-group-footer" style={{ display: "flex", alignItems: "center", gap: 8, color: group.color }}>
                Mehr erfahren <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>

        {/* Finder Box */}
        <div className="dm-finder">
          <div>
            <p className="dm-eyebrow">Noch unsicher?</p>
            <h2>
              Welche Gruppe passt <span className="dm-gt">zu dir?</span>
            </h2>
            <p style={{ marginBottom: 28 }}>
              Komm einfach zu einer kostenlosen Probestunde vorbei. Wir helfen
              dir, die richtige Gruppe für dein Alter und dein Können zu finden.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/formulare" className="dm-btn-primary">
                Probestunde buchen ✦
              </Link>
              <Link href="/termine" className="dm-btn-ghost">
                Termine ansehen
              </Link>
            </div>
          </div>
          <div className="dm-finder-items">
            {cards.map((group) => (
              <Link
                key={group.slug}
                href={`/gruppen/${group.slug}`}
                className="dm-finder-item"
              >
                <span
                  className="dm-finder-dot"
                  style={{ background: group.color }}
                />
                <span>
                  <strong>{group.name}</strong>
                  <span>{group.age}</span>
                </span>
              </Link>
            ))}
            <div className="dm-finder-item">
              <span
                className="dm-finder-dot"
                style={{ background: "var(--accent)" }}
              />
              <span>
                <strong>Erwachsene & Eltern</strong>
                <span>Sprich uns an — wir finden eine Lösung</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

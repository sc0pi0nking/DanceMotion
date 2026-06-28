"use client";

import Link from "next/link";

export interface BentoGroupItem {
  slug: string;
  name: string;
  description: string;
  href: string;
  color: string;
  age: string;
  location: string;
  schedule: string;
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function handleMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// asymmetrisches 7/5 + 5/7 Layout
const SPANS = ["span-7", "span-5", "span-5", "span-7"];

export default function BentoGroups({ items }: { items: BentoGroupItem[] }) {
  return (
    <div className="dm-bento">
      {items.map((group, index) => (
        <Link
          key={group.slug}
          href={group.href}
          className={`dm-bento-card ${SPANS[index % SPANS.length]}`}
          style={{ ["--group" as string]: group.color }}
          onMouseMove={handleMove}
        >
          <span className="dm-bento-pill">
            <span className="dm-bento-pill-dot" />
            {group.age}
          </span>
          <h3 className="dm-bento-name">{group.name}</h3>
          <p className="dm-bento-desc">{group.description}</p>
          <div className="dm-bento-spacer" />
          <div className="dm-bento-meta">
            {group.location && <span>📍 {group.location}</span>}
            {group.schedule && <span>🕓 {group.schedule}</span>}
          </div>
          <span className="dm-bento-arrow">
            <ArrowIcon />
          </span>
          <span className="dm-bento-visual" />
        </Link>
      ))}

      {/* CTA-Karte schließt das Raster zum 7/5 + 5/7 Muster */}
      <Link
        href="/gruppen"
        className="dm-bento-card is-cta span-7"
        onMouseMove={handleMove}
      >
        <span
          className="dm-eyebrow"
          style={{ marginBottom: 16 }}
        >
          Noch unsicher?
        </span>
        <h3 className="dm-bento-name" style={{ maxWidth: 480 }}>
          Wir helfen dir, die richtige Gruppe zu finden
        </h3>
        <p className="dm-bento-desc">
          Kein Vorwissen nötig. Komm einfach vorbei — die erste Probestunde ist
          immer kostenlos.
        </p>
        <div className="dm-bento-spacer" />
        <span className="dm-btn-primary dm-btn-sm" style={{ width: "fit-content" }}>
          Alle Gruppen ansehen →
        </span>
        <span className="dm-bento-arrow">
          <ArrowIcon />
        </span>
      </Link>
    </div>
  );
}

import Link from "next/link";
import HeroScene from "./components/HeroScene";
import StatsBand from "./components/StatsBand";
import BentoGroups, { type BentoGroupItem } from "./components/BentoGroups";
import { ContentProvider } from "@/lib/content-context";
import { fetchActiveGroups } from "@/lib/groups-db";
import { getGroupPresentation, FALLBACK_GROUPS } from "@/lib/group-presentation";
import { getUpcomingEvents } from "../lib/events-cache";
import { loadContentBatch } from "../lib/content-loader";
import "./gradients.css";
import "./home.css";

const HOME_CONTENT_KEYS = ["hero.title", "hero.subtitle"];

const MONTHS_DE = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

function eventDateParts(dateStr: string): { day: string; mon: string } {
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return { day: "–", mon: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    mon: MONTHS_DE[d.getMonth()],
  };
}

export default async function Home() {
  const [dbGroups, upcomingEvents, content] = await Promise.all([
    fetchActiveGroups(),
    getUpcomingEvents(3),
    loadContentBatch(HOME_CONTENT_KEYS),
  ]);

  const groups = dbGroups.length > 0 ? dbGroups : FALLBACK_GROUPS;

  const bentoItems: BentoGroupItem[] = groups.map((group) => {
    const presentation = getGroupPresentation(
      group.slug,
      (group as { color?: string }).color ?? null
    );
    return {
      slug: group.slug,
      name: group.name,
      description: group.short_desc ?? "",
      href: `/gruppen/${group.slug}`,
      color: presentation.color,
      age: presentation.age,
      location: presentation.location,
      schedule: presentation.schedule,
    };
  });

  return (
    <ContentProvider initialContent={content}>
      <div className="min-h-screen">
        {/* HERO — volle Viewport-Höhe, Torus + Gradient-Heading */}
        <HeroScene />

        {/* STATS BAND — 4 Zellen mit Separator + CountUp */}
        <StatsBand />

        {/* GRUPPEN — Bento Grid */}
        <section id="groups" className="dm-wrap">
          <p className="dm-eyebrow">Unsere Gruppen</p>
          <h2 className="dm-title">
            Für jeden den <span className="dm-gt">richtigen Rhythmus</span>
          </h2>
          <p className="dm-sub">
            Von den Kleinsten bis zu den Profis — bei DanceMotion findet jeder
            seine Gruppe und seine Bühne.
          </p>

          <BentoGroups items={bentoItems} />
        </section>

        {/* EVENTS PREVIEW */}
        <section id="events" className="dm-wrap" style={{ paddingTop: 0 }}>
          <div className="dm-events-head">
            <div>
              <p className="dm-eyebrow">Kommende Termine</p>
              <h2 className="dm-title" style={{ marginBottom: 0 }}>
                Was als Nächstes <span className="dm-gt">ansteht</span>
              </h2>
            </div>
            <Link href="/termine" className="dm-btn-ghost dm-btn-sm">
              Alle Termine →
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="dm-event-empty">
              Aktuell sind keine Termine eingetragen — schau bald wieder vorbei.
            </div>
          ) : (
            upcomingEvents.slice(0, 3).map((event) => {
              const { day, mon } = eventDateParts(event.date);
              const meta = [
                event.time ? `${event.time} Uhr` : null,
                event.location,
                event.category,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <Link key={event.id} href="/termine" className="dm-event-row">
                  <div className="dm-event-date">
                    <span className="day">{day}</span>
                    <span className="mon">{mon}</span>
                  </div>
                  <div className="dm-event-body">
                    <div className="dm-event-title">{event.title}</div>
                    <div className="dm-event-meta">{meta}</div>
                  </div>
                  <span className="dm-event-arrow">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              );
            })
          )}
        </section>

        {/* CTA */}
        <div className="dm-cta" id="cta">
          <div className="dm-cta-inner">
            <p className="dm-eyebrow" style={{ marginBottom: 14 }}>
              Mitmachen
            </p>
            <h2>
              Bereit, deinen Rhythmus <span className="dm-gt">zu entdecken?</span>
            </h2>
            <p>
              Komm einfach zur kostenlosen Probestunde — unverbindlich, herzlich
              willkommen, mit Garantie auf gute Laune.
            </p>
            <div className="dm-cta-btns">
              <Link href="/gruppen" className="dm-btn-primary">
                Gruppe finden ✦
              </Link>
              <Link href="/formulare" className="dm-btn-ghost">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentProvider>
  );
}

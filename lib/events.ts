/**
 * Events Data Model
 * Statische Event-Daten mit Hilfsfunktionen für Timeline
 */

export type EventCategory = "Auftritt" | "Workshop" | "Training" | "Event";
export type GroupSlug = "little-joys" | "smileys" | "emotion";

export type Event = {
  id: string;
  title: string;
  date: string; // ISO format "YYYY-MM-DD"
  time?: string; // "HH:mm"
  location: string; // Venue or place name
  city: string;
  category: EventCategory;
  groups?: GroupSlug[];
  note?: string; // Optional subtitle
  href?: string; // Optional link
};

/**
 * Demo Events (at least 10 mixed entries)
 * Mix of upcoming and past events for testing
 */
export const events: Event[] = [
  // UPCOMING
  {
    id: "evt-001",
    title: "Sommerfest DanceMotion",
    date: "2026-01-18",
    time: "14:00",
    location: "Studio DanceMotion",
    city: "Berlin",
    category: "Event",
    groups: ["little-joys", "smileys", "emotion"],
    note: "Mit Live-Performance aller Gruppen",
    href: "/termine",
  },
  {
    id: "evt-002",
    title: "Little Joys Open Class",
    date: "2026-01-25",
    time: "16:00",
    location: "Studio Mitte",
    city: "Berlin",
    category: "Workshop",
    groups: ["little-joys"],
    note: "Für Anfänger geeignet",
  },
  {
    id: "evt-003",
    title: "Emotion Live Auftritt",
    date: "2026-02-08",
    time: "19:30",
    location: "Kulturzentrum Wedding",
    city: "Berlin",
    category: "Auftritt",
    groups: ["emotion"],
    href: "/gruppen/emotion",
  },
  {
    id: "evt-004",
    title: "Smileys & Emotion Gala",
    date: "2026-02-22",
    time: "18:00",
    location: "Theater an der Parkaue",
    city: "Berlin",
    category: "Event",
    groups: ["smileys", "emotion"],
    note: "Großes Jahres-Event",
  },
  {
    id: "evt-005",
    title: "Workshop: Hip-Hop Basics",
    date: "2026-03-07",
    time: "17:00",
    location: "Studio DanceMotion",
    city: "Berlin",
    category: "Workshop",
    note: "Mit Gast-Choreograph",
  },
  {
    id: "evt-006",
    title: "Emotion Frühjahrs-Auftritt",
    date: "2026-03-21",
    time: "19:00",
    location: "Kulturzentrum Wedding",
    city: "Berlin",
    category: "Auftritt",
    groups: ["emotion"],
  },
  {
    id: "evt-007",
    title: "Training Session: Alle Gruppen",
    date: "2026-04-04",
    time: "16:00",
    location: "Studio DanceMotion",
    city: "Berlin",
    category: "Training",
    groups: ["little-joys", "smileys", "emotion"],
  },
  {
    id: "evt-008",
    title: "Smileys Open Performance",
    date: "2026-04-18",
    time: "15:00",
    location: "Kreuzberger Festivus",
    city: "Berlin",
    category: "Auftritt",
    groups: ["smileys"],
    note: "Kostenlos für alle",
  },

  // PAST EVENTS
  {
    id: "evt-009",
    title: "Neujahrs-Gala",
    date: "2026-01-10",
    time: "19:30",
    location: "Studio DanceMotion",
    city: "Berlin",
    category: "Event",
    groups: ["little-joys", "smileys", "emotion"],
  },
  {
    id: "evt-010",
    title: "Winter Dance Workshop",
    date: "2025-12-20",
    time: "14:00",
    location: "Studio DanceMotion",
    city: "Berlin",
    category: "Workshop",
    note: "Mit Gast-Choreograph",
  },
  {
    id: "evt-011",
    title: "Dezember-Auftritt Emotion",
    date: "2025-12-15",
    time: "19:00",
    location: "Kulturzentrum Wedding",
    city: "Berlin",
    category: "Auftritt",
    groups: ["emotion"],
  },
  {
    id: "evt-012",
    title: "Advents-Performance",
    date: "2025-12-07",
    time: "18:00",
    location: "Christmas Market",
    city: "Berlin",
    category: "Event",
    groups: ["little-joys", "smileys"],
  },
];

/**
 * Get today's date in YYYY-MM-DD format (local time)
 */
function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get upcoming events (date >= today)
 */
export function getUpcomingEvents(limit?: number): Event[] {
  const today = getTodayISO();
  const upcoming = events
    .filter((evt) => evt.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Get past events (date < today)
 */
export function getPastEvents(limit?: number): Event[] {
  const today = getTodayISO();
  const past = events
    .filter((evt) => evt.date < today)
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  return limit ? past.slice(0, limit) : past;
}

/**
 * Sort events ascending (oldest first)
 */
export function sortEventsAsc(evts: Event[]): Event[] {
  return [...evts].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Sort events descending (newest first)
 */
export function sortEventsDesc(evts: Event[]): Event[] {
  return [...evts].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Format date to German locale string (e.g., "Sa, 14. Juni 2026")
 */
export function formatDateGerman(dateStr: string, showYear?: boolean): string {
  const date = new Date(dateStr + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    ...(showYear && { year: "numeric" }),
  };
  return new Intl.DateTimeFormat("de-DE", options).format(date);
}

/**
 * Get group color/badge info (extend as needed)
 */
export function getGroupBadgeInfo(slug: GroupSlug): {
  label: string;
  color: string;
} {
  const groupMap: Record<
    GroupSlug,
    { label: string; color: string }
  > = {
    "little-joys": { label: "Little Joys", color: "rgba(46,196,198,0.2)" },
    smileys: { label: "Smileys", color: "rgba(46,196,198,0.15)" },
    emotion: { label: "Emotion", color: "rgba(46,196,198,0.25)" },
  };
  return groupMap[slug] || { label: slug, color: "rgba(46,196,198,0.1)" };
}

/**
 * Get category badge color
 */
export function getCategoryColor(
  category: EventCategory
): {
  bg: string;
  text: string;
} {
  const categoryMap: Record<
    EventCategory,
    { bg: string; text: string }
  > = {
    Auftritt: { bg: "rgba(46,196,198,0.3)", text: "var(--accent)" },
    Workshop: { bg: "rgba(46,196,198,0.2)", text: "var(--accent)" },
    Training: { bg: "rgba(46,196,198,0.15)", text: "var(--accent)" },
    Event: { bg: "rgba(46,196,198,0.25)", text: "var(--accent)" },
  };
  return categoryMap[category];
}

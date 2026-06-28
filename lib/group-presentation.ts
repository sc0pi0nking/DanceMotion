import type { Group } from "./groups-db";

/** Visuelle Zusatzinfos je Gruppe für Homepage-Bento + Gruppen-Übersicht. */
export interface GroupPresentation {
  color: string;
  age: string;
  icon: string;
  location: string;
  schedule: string;
}

export const GROUP_PRESENTATION: Record<string, GroupPresentation> = {
  "little-joys": {
    color: "#f59e0b",
    age: "4 – 8 Jahre",
    icon: "✨",
    location: "Turnhalle am Talbahnhof, Eschweiler",
    schedule: "Mi. 15:30 – 16:30",
  },
  smileys: {
    color: "#22c55e",
    age: "8 – 14 Jahre",
    icon: "😄",
    location: "Turnhalle am Talbahnhof, Eschweiler",
    schedule: "Di. 16:30 – 17:30",
  },
  emotion: {
    color: "#a855f7",
    age: "14+ Jahre",
    icon: "💜",
    location: "Turnhalle am Talbahnhof, Eschweiler",
    schedule: "Mo. 19:00 & Mi. 18:00",
  },
};

const DEFAULT_PRESENTATION: GroupPresentation = {
  color: "#2EC4C6",
  age: "Alle Altersgruppen",
  icon: "💃",
  location: "Turnhalle am Talbahnhof, Eschweiler",
  schedule: "Termine auf Anfrage",
};

/** Präsentations-Defaults für einen Slug (mit DB-Farbe als Fallback). */
export function getGroupPresentation(
  slug: string,
  dbColor?: string | null
): GroupPresentation {
  const preset = GROUP_PRESENTATION[slug];
  if (preset) return preset;
  return {
    ...DEFAULT_PRESENTATION,
    color: dbColor && dbColor !== "#2EC4C6" ? dbColor : DEFAULT_PRESENTATION.color,
  };
}

/** Fallback-Gruppen, falls die DB (noch) leer ist. */
export const FALLBACK_GROUPS: Pick<
  Group,
  "slug" | "name" | "short_desc"
>[] = [
  {
    slug: "little-joys",
    name: "Little Joys",
    short_desc:
      "Tanzen für die Kleinsten — spielerisch, kindgerecht und mit viel Freude.",
  },
  {
    slug: "smileys",
    name: "Smileys",
    short_desc:
      "Fröhliche Gruppe für Kinder und Jugendliche mit modernem Tanz und Musik.",
  },
  {
    slug: "emotion",
    name: "Emotion",
    short_desc:
      "Ausdrucksstarker Tanz für Jugendliche und Erwachsene — hier zählt dein Gefühl.",
  },
];

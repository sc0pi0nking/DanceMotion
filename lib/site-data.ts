export type Tile = {
  title: string;
  slug: string;
  shortDescription: string;
  href: string;
};

export const tiles: Tile[] = [
  {
    title: "Little Joys",
    slug: "little-joys",
    shortDescription: "Tanzen für die Kleinsten — spielerisch und mit viel Freude.",
    href: "/gruppen/little-joys",
  },
  {
    title: "Smileys",
    slug: "smileys",
    shortDescription: "Fröhliche Gruppe für Kinder mit Bewegung und Musik.",
    href: "/gruppen/smileys",
  },
  {
    title: "Emotion",
    slug: "emotion",
    shortDescription: "Ausdrucksstarker Tanz für Jugendliche und Erwachsene.",
    href: "/gruppen/emotion",
  },
  {
    title: "Eventstudio",
    slug: "eventstudio",
    shortDescription: "Vermietung & Kurse: Unser Studio für Events und Proben.",
    href: "/eventstudio",
  },
];

export default tiles;

export type Tile = {
  title: string;
  slug: string;
  shortDescription: string;
  href: string;
logo?: string;
};

export const tiles: Tile[] = [
  {
    title: "Little Joys",
    slug: "little-joys",
    shortDescription: "Tanzen für die Kleinsten — spielerisch und mit viel Freude.",
    href: "/gruppen/little-joys",
    logo: "/logo-littlejoys.svg",
  },
  {
    title: "Smileys",
    slug: "smileys",
    shortDescription: "Fröhliche Gruppe für Kinder mit Bewegung und Musik.",
    href: "/gruppen/smileys",
    logo: "/logo-smileys.svg",
  },
  {
    title: "Emotion",
    slug: "emotion",
    shortDescription: "Ausdrucksstarker Tanz für Jugendliche und Erwachsene.",
    href: "/gruppen/emotion",
    logo: "/logo-emotion.svg",
  },
];

export default tiles;

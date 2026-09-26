import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termine & Events",
  description:
    "Alle kommenden Auftritte, Shows und Veranstaltungen von DanceMotion Eschweiler auf einen Blick.",
  alternates: { canonical: "/termine" },
  openGraph: {
    type: "website",
    url: "https://dancemotion.org/termine",
    title: "Termine & Events — DanceMotion Eschweiler",
    description:
      "Alle kommenden Auftritte, Shows und Veranstaltungen von DanceMotion Eschweiler auf einen Blick.",
    images: ["/og-image.jpg"],
  },
};

export default function TermineLayout({ children }: { children: React.ReactNode }) {
  return children;
}

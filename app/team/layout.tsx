import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unser Team",
  description:
    "Lernen Sie die Trainerinnen, Trainer und das Team hinter DanceMotion Eschweiler kennen.",
  alternates: { canonical: "/team" },
  openGraph: {
    type: "website",
    url: "https://dancemotion.org/team",
    title: "Unser Team — DanceMotion Eschweiler",
    description:
      "Lernen Sie die Trainerinnen, Trainer und das Team hinter DanceMotion Eschweiler kennen.",
    images: ["/og-image.jpg"],
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}

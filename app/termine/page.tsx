import type { Metadata } from "next";
import { getUpcomingEvents, getPastEvents } from "../../lib/events-cache";
import TermineContent from "./TermineContent";

export const metadata: Metadata = {
  title: "Termine & Auftritte",
  description:
    "Alle kommenden Auftritte, Workshops und Events der DanceMotion Community in Eschweiler.",
  alternates: { canonical: "/termine" },
};

export default async function TerminePage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return <TermineContent upcoming={upcomingEvents} past={pastEvents} />;
}

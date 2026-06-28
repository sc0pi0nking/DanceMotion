import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, MapPin, Calendar } from "lucide-react";
import EditableContent from "@/app/components/EditableContent";
import { ContentProvider } from "@/lib/content-context";
import { fetchActiveGroups, fetchGroupBySlug } from "@/lib/groups-db";
import { loadContentBatch } from "@/lib/content-loader";

const editBtn =
  "absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/20";

interface GroupDefaults {
  subtitle: string;
  training_heading: string;
  training_times: string;
  training_location: string;
  for_whom: string;
  what_to_expect: string;
  contact_text: string;
}

const GROUP_DEFAULTS: Record<string, GroupDefaults> = {
  "little-joys": {
    subtitle: "Tanzen für die Kleinsten — spielerisch und mit viel Freude.",
    training_heading: "Trainingszeiten",
    training_times: "Freitags: 15:30 – 16:30 Uhr",
    training_location: "Turnhalle am Talbahnhof, Eschweiler",
    for_whom:
      "Little Joys ist für Kinder, die Freude an Bewegung und Musik haben. Hier geht es um spielerisches Tanzen, Entdecken und Spaß miteinander.",
    what_to_expect:
      "• Spielerische Choreografien zu Musik\n• Bewegungsfreiheit und Ausdruck fördern\n• Gemeinschaft und Freundschaften\n• Rhythmus und Koordination entwickeln",
    contact_text:
      "Interessiert? Schreib uns eine Nachricht oder komm vorbei — wir freuen uns auf dich!",
  },
  smileys: {
    subtitle: "Fröhliche Gruppe für Kinder mit Bewegung und Musik.",
    training_heading: "Trainingszeiten",
    training_times: "Dienstags: 16:30 – 17:30 Uhr",
    training_location: "Turnhalle am Talbahnhof, Eschweiler",
    for_whom:
      "Smileys richtet sich an Kinder, die Freude am Tanzen und an der Gemeinschaft haben. Hier dreht es sich um Spaß, Energie und positive Vibes!",
    what_to_expect:
      "• Moderne, fröhliche Choreografien\n• Kreative Ausdrucksformen\n• Teamgeist und positive Atmosphäre\n• Performances und gemeinsame Events",
    contact_text:
      "Neugierig geworden? Komm zu unserem nächsten Treffen oder schreib uns!",
  },
  emotion: {
    subtitle: "Ausdrucksstarker Tanz für Jugendliche und Erwachsene.",
    training_heading: "Trainingszeiten",
    training_times: "Montags: 19:00 – 20:30 Uhr\nMittwochs: 18:00 – 19:30 Uhr",
    training_location: "Turnhalle am Talbahnhof, Eschweiler",
    for_whom:
      "Emotion ist für dich, wenn du deinen eigenen Ausdruck finden möchtest. Wir tanzen nicht nur Choreografien — wir bringen Gefühle zum Ausdruck und erkunden unsere Persönlichkeit durch Bewegung.",
    what_to_expect:
      "• Contemporary & Modern Dance\n• Persönlicher künstlerischer Ausdruck\n• Intensive Trainingssessions\n• Auftritte und künstlerische Projekte\n• Eine unterstützende Community",
    contact_text: "Bereit, deine Kreativität auszudrücken? Komm mit zu uns!",
  },
};

function getDefaults(slug: string, shortDesc: string | null): GroupDefaults {
  return (
    GROUP_DEFAULTS[slug] ?? {
      subtitle: shortDesc ?? "",
      training_heading: "Trainingszeiten",
      training_times: "Termine auf Anfrage",
      training_location: "Turnhalle am Talbahnhof, Eschweiler",
      for_whom: shortDesc ?? "",
      what_to_expect: "",
      contact_text: "Interessiert? Schreib uns eine Nachricht — wir freuen uns auf dich!",
    }
  );
}

const CONTENT_FIELDS = [
  "subtitle",
  "training_heading",
  "training_times",
  "training_location",
  "for_whom",
  "what_to_expect",
  "contact_text",
] as const;

export async function generateStaticParams() {
  const groups = await fetchActiveGroups();
  return groups.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = await fetchGroupBySlug(slug);
  if (!group) {
    return { title: "Gruppe nicht gefunden — DanceMotion Eschweiler" };
  }
  const defaults = getDefaults(slug, group.short_desc);
  const description = group.short_desc || defaults.subtitle;
  return {
    title: `${group.name} — DanceMotion Eschweiler`,
    description,
    alternates: { canonical: `/gruppen/${slug}` },
    openGraph: {
      title: `${group.name} — DanceMotion Eschweiler`,
      description,
    },
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = await fetchGroupBySlug(slug);
  if (!group) {
    notFound();
  }

  const defaults = getDefaults(slug, group.short_desc);
  const contentKeys = CONTENT_FIELDS.map((field) => `${slug}.${field}`);
  const content = await loadContentBatch(contentKeys);

  return (
    <ContentProvider initialContent={content}>
      <div className="mx-auto max-w-3xl px-6 py-16 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:underline animated-heading"
          style={{ color: "var(--accent)" }}
        >
          <span>←</span> Zurück zur Startseite
        </Link>

        {/* Logo with glassmorphism background */}
        {group.logo_url && (
          <div className="mt-8 mb-8 flex justify-center">
            <div className="glassmorphism p-8 rounded-2xl">
              <Image
                src={group.logo_url}
                alt={`${group.name} Logo`}
                width={128}
                height={128}
                className="h-32 w-32 object-contain mx-auto hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        )}

        <h1
          className="text-4xl font-bold text-center animated-heading px-4"
          style={{ color: "var(--fg)" }}
        >
          {group.name}
        </h1>
        <EditableContent
          contentKey={`${slug}.subtitle`}
          defaultValue={defaults.subtitle}
          className="mt-6 text-lg text-center"
          style={{ color: "var(--muted)" }}
        />

        <div className="mt-16 space-y-12">
          {/* Trainingszeiten Section - Admin-editierbar */}
          <section
            className="rounded-2xl p-8 md:p-12"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Calendar size={28} />
              <EditableContent
                contentKey={`${slug}.training_heading`}
                defaultValue={defaults.training_heading}
                as="span"
                className="text-2xl font-semibold"
                editButtonClassName={editBtn}
                editIconClassName="text-white"
              />
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock size={20} className="mt-1 flex-shrink-0" style={{ opacity: 0.9 }} />
                <div>
                  <EditableContent
                    contentKey={`${slug}.training_times`}
                    defaultValue={defaults.training_times}
                    className="font-medium whitespace-pre-line"
                    multiline
                    as="div"
                    editButtonClassName={editBtn}
                    editIconClassName="text-white"
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" style={{ opacity: 0.9 }} />
                <EditableContent
                  contentKey={`${slug}.training_location`}
                  defaultValue={defaults.training_location}
                  className="font-medium"
                  editButtonClassName={editBtn}
                  editIconClassName="text-white"
                />
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
              Für wen?
            </h2>
            <EditableContent
              contentKey={`${slug}.for_whom`}
              defaultValue={defaults.for_whom}
              className="leading-relaxed"
              style={{ color: "var(--muted)" }}
              multiline
            />
          </section>

          <section className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
              Was erwartet dich?
            </h2>
            <EditableContent
              contentKey={`${slug}.what_to_expect`}
              defaultValue={defaults.what_to_expect}
              className="leading-relaxed whitespace-pre-line"
              style={{ color: "var(--muted)" }}
              multiline
              as="div"
            />
          </section>

          <section className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
              Kontakt & Anmeldung
            </h2>
            <EditableContent
              contentKey={`${slug}.contact_text`}
              defaultValue={defaults.contact_text}
              className="leading-relaxed"
              style={{ color: "var(--muted)" }}
              multiline
            />
            <a
              href="mailto:info@dancemotion-eschweiler.de"
              className="inline-block mt-4 px-6 py-3 rounded-full font-semibold"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
            >
              Jetzt Kontakt aufnehmen
            </a>
          </section>
        </div>
      </div>
    </ContentProvider>
  );
}

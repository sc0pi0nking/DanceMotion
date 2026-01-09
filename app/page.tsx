"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import HeroScene from "./components/HeroScene";
import EventTimeline from "./components/EventTimeline";
import EditableContent from "./components/EditableContent";
import { tiles } from "../lib/site-data";
import { fetchUpcomingEvents } from "../lib/events-db";
import type { Event } from "../lib/supabase";

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await fetchUpcomingEvents(4);
        setUpcomingEvents(events);
      } catch (error) {
        console.error("Failed to load events:", error);
        setUpcomingEvents([]);
      } finally {
        setEventsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroScene />

      {/* Groups Section - Alternating Layout */}
      <section id="groups" className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-16">
          <h2 className="text-4xl font-bold" style={{ color: "var(--fg)" }}>
            Unsere Gruppen
          </h2>
          <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
            Verschiedene Stile, eine Community
          </p>
        </div>
        
        {/* Alternating Groups - Text/Image Left-Right */}
        <div className="space-y-24">
          {tiles.map((tile, index) => (
            <div
              key={tile.slug}
              className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
              style={{
                direction: index % 2 === 1 ? "rtl" : "ltr",
              }}
            >
              {/* Image/Visual Side */}
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(46,196,198,0.2), rgba(46,196,198,0.08))`,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(46,196,198,0.15)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {tile.logo ? (
                        <Image
                          src={tile.logo}
                          alt={tile.title}
                          width={120}
                          height={120}
                          className="mx-auto opacity-70"
                        />
                      ) : (
                        <div className="text-5xl font-bold opacity-20" style={{ color: "var(--accent)" }}>
                          💃
                        </div>
                      )}
                      <p className="mt-6 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                        {tile.title}
                      </p>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div
                    className="absolute top-4 right-4 h-20 w-20 rounded-full opacity-15"
                    style={{
                      background: "radial-gradient(circle, var(--accent), transparent)",
                    }}
                  ></div>
                  <div
                    className="absolute bottom-4 left-4 h-28 w-28 rounded-full opacity-10"
                    style={{
                      background: "radial-gradient(circle, var(--accent), transparent)",
                    }}
                  ></div>
                </div>
              </div>

              {/* Text/Info Side */}
              <div style={{ direction: "ltr" }} className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1" 
                     style={{ backgroundColor: "rgba(46,196,198,0.1)" }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }}></span>
                  <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    Tanzgruppe
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold leading-tight" style={{ color: "var(--fg)" }}>
                  {tile.title}
                </h3>
                
                <EditableContent
                  contentKey={`${tile.slug}.short_description`}
                  defaultValue={tile.shortDescription}
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--muted)" }}
                  multiline
                />

                <div className="mt-8 flex gap-3">
                  <Link
                    href={`/gruppen/${tile.slug}`}
                    className="inline-flex items-center rounded-full px-6 py-3 font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--bg)",
                    }}
                  >
                    Mehr erfahren →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Timeline Section - NEW */}
      <section id="events" className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-16">
          <h2 className="text-4xl font-bold" style={{ color: "var(--fg)" }}>
            Nächste Auftritte & Events
          </h2>
          <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
            Was als Nächstes ansteht – komm vorbei und supporte uns.
          </p>
        </div>

        <EventTimeline events={upcomingEvents} variant="compact" />

        <div className="mt-12 text-center">
          <Link
            href="/termine"
            className="inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300"
            style={{
              backgroundColor: "var(--accent)",
              color: "#000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "drop-shadow(0 12px 28px rgba(46,196,198,0.28))";
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            Alle Termine ansehen →
          </Link>
        </div>
      </section>

      {/* Event Studio Section - VISUALLY DIFFERENT FROM GROUPS */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="relative rounded-3xl p-12 lg:p-16 overflow-hidden"
             style={{
               background: "linear-gradient(135deg, rgba(46,196,198,0.06), rgba(46,196,198,0.02))",
               border: "1px solid rgba(46,196,198,0.15)",
               backdropFilter: "blur(8px)",
             }}>
          
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center relative z-10">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2" 
                   style={{ backgroundColor: "rgba(46,196,198,0.15)", border: "1px solid rgba(46,196,198,0.3)" }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }}></span>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>Spezialangebot</span>
              </div>
              
              <h2 className="mt-8 text-4xl font-bold leading-tight" style={{ color: "var(--fg)" }}>
                DanceMotion <br /> <span style={{ color: "var(--accent)" }}>Eventstudio</span>
              </h2>
              
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                Professionelle Räume für Vermietung, Proben und Events. Dein Platz für Creativity und Performance.
              </p>

              <div className="mt-10 flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }}></div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--fg)" }}>Stundenvermietung</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Tagsüber bis abends, flexibel buchbar</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }}></div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--fg)" }}>Professionelle Ausstattung</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Großer Spiegel, Soundanlage, Klimaanlage</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }}></div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--fg)" }}>Event-Hosting</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Für Performances und spezielle Events</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href="/eventstudio"
                  className="inline-flex items-center rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#000",
                  }}
                >
                  Studio erkunden →
                </Link>
              </div>
            </div>

            {/* Right: Visual Element - DIFFERENT STYLE */}
            <div className="relative h-80 hidden lg:flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Background blob */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "radial-gradient(circle at 60% 40%, rgba(46,196,198,0.15), rgba(46,196,198,0.02))",
                    border: "1px solid rgba(46,196,198,0.2)",
                  }}
                >
                  {/* Large center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Image
                        src="/logo-dms.svg"
                        alt="DanceMotion Eventstudio"
                        width={140}
                        height={140}
                        className="mx-auto opacity-60"
                      />
                      <p className="mt-8 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                        Event Studio
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div
                    className="absolute top-8 right-8 h-16 w-16 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(46,196,198,0.25), transparent)",
                      filter: "blur(24px)",
                    }}
                  ></div>
                  <div
                    className="absolute bottom-12 left-12 h-24 w-24 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(46,196,198,0.2), transparent)",
                      filter: "blur(28px)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decorative element for eventstudio section */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(46,196,198,0.4), transparent)",
              transform: "translate(100px, -100px)",
            }}
          ></div>
        </div>
      </section>
    </div>
  );
}

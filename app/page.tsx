"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, memo } from "react";
import HeroScene from "./components/HeroScene";
import EventTimeline from "./components/EventTimeline";
import EditableContent from "./components/EditableContent";
import { Button, LinkButton } from "./components/Button";
import { tiles } from "../lib/site-data";
import { fetchUpcomingEvents } from "../lib/events-db";
import type { Event } from "../lib/supabase";
import "./gradients.css";

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
      {/* Hero - Normal, scrollable */}
      <HeroScene />

      {/* Content wrapper */}
      <div className="relative w-full">
        {/* Decorative gradient background under header */}
        <div 
          className="h-32 pointer-events-none relative z-10"
          style={{ background: "var(--gradient-hero-fade)" }}
        />

      {/* Groups Section - Alternating Layout */}
      <section id="groups" className="mx-auto max-w-6xl px-6 py-20 sm:py-24 relative z-20">
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
              className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center group"
              style={{
                direction: index % 2 === 1 ? "rtl" : "ltr",
              }}
            >
              {/* Image/Visual Side */}
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group">
                <div
                  className="absolute inset-0 rounded-2xl transition-all duration-500 group-hover:border-accent-bright backdrop-blur-sm"
                  style={{
                    background: "var(--gradient-card-light)",
                    backdropFilter: "var(--backdrop-blur-medium)",
                    border: "var(--border-accent)",
                    boxShadow: "inset 0 1px 2px rgba(46,196,198,0.1)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-center">
                      {tile.logo ? (
                        <Image
                          src={tile.logo}
                          alt={tile.title}
                          width={120}
                          height={120}
                          className="mx-auto opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                          loading="lazy"
                          priority={false}
                        />
                      ) : (
                        <div className="text-5xl font-bold opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ color: "var(--accent)" }}>
                          💃
                        </div>
                      )}
                      <p className="mt-6 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                        {tile.title}
                      </p>
                    </div>
                  </div>
                  {/* Decorative circles - more prominent on hover */}
                  <div
                    className="absolute top-4 right-4 h-20 w-20 rounded-full opacity-15 group-hover:opacity-35 transition-opacity duration-500"
                    style={{ background: "var(--gradient-radial-accent)" }}
                  ></div>
                  <div
                    className="absolute bottom-4 left-4 h-28 w-28 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500"
                    style={{ background: "var(--gradient-radial-accent)" }}
                  ></div>
                </div>
              </div>

              {/* Text/Info Side */}
              <div style={{ direction: "ltr" }} className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1" 
                     style={{ backgroundColor: "var(--badge-bg-subtle)" }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent-dot)" }}></span>
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
                  <LinkButton
                    href={`/gruppen/${tile.slug}`}
                    variant="primary"
                    size="md"
                  >
                    Mehr erfahren →
                  </LinkButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Timeline Section - NEW */}
      <section id="events" className="mx-auto max-w-6xl px-6 py-20 sm:py-24 relative z-20">
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
          <LinkButton
            href="/termine"
            variant="primary"
            size="lg"
          >
            Alle Termine ansehen →
          </LinkButton>
        </div>
      </section>

      </div>
    </div>
  );
}

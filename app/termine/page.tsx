"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import HeroScene from "../components/HeroScene";
import EventTimeline from "../components/EventTimeline";
import { fetchUpcomingEvents, fetchPastEvents } from "../../lib/events-db";
import type { Event } from "../../lib/supabase";

export default function TerminePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllPast, setShowAllPast] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents(): Promise<void> {
    try {
      const [upcoming, past] = await Promise.all([
        fetchUpcomingEvents(),
        fetchPastEvents(),
      ]);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  }

  const displayedPastEvents = showAllPast ? pastEvents : pastEvents.slice(0, 8);

  return (
    <div className="min-h-screen">
      <HeroScene />

      {/* Header section */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: "var(--fg)" }}
        >
          Termine & Auftritte
        </h1>
        <p
          className="text-lg max-w-2xl"
          style={{ color: "var(--muted)" }}
        >
          Schau dich um und sei dabei! Hier findest du alle kommenden Auftritte, 
          Workshops und Events der DanceMotion Community.
        </p>
      </section>

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--fg)" }}
            >
              Kommende Termine
            </h2>
            <p style={{ color: "var(--muted)" }}>
              {upcomingEvents.length} Events in den kommenden Wochen
            </p>
          </div>

          <EventTimeline events={upcomingEvents} variant="full" showYear={true} />
        </section>
      )}

      {/* No upcoming events fallback */}
      {upcomingEvents.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div
            className="p-8 rounded-2xl text-center"
            style={{
              backgroundColor: "var(--panel)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-lg"
              style={{ color: "var(--muted)" }}
            >
              Keine kommenden Termine. Schau später wieder vorbei!
            </p>
          </div>
        </section>
      )}

      {/* Past events */}
      {pastEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="mb-12">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--fg)" }}
            >
              Vergangene Events
            </h2>
            <p style={{ color: "var(--muted)" }}>
              {pastEvents.length} Events aus den letzten Monaten
            </p>
          </div>

          <EventTimeline events={displayedPastEvents} variant="full" showYear={true} />

          {/* Load more button */}
          {pastEvents.length > 8 && !showAllPast && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setShowAllPast(true)}
                className="px-8 py-4 rounded-full font-semibold transition-all duration-300"
                style={{
                  backgroundColor: "rgba(46,196,198,0.1)",
                  color: "var(--accent)",
                  border: "1px solid rgba(46,196,198,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(46,196,198,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(46,196,198,0.1)";
                }}
              >
                Weitere Events laden ↓
              </button>
            </div>
          )}
        </section>
      )}

      {/* Footer note */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p
          className="text-sm text-center italic"
          style={{ color: "var(--muted)" }}
        >
          Änderungen vorbehalten. Für aktuelle Infos schreib uns eine Email!
        </p>
      </section>

      {/* CTA back to home or groups */}
      <section
        className="mx-auto max-w-6xl px-6 py-16 rounded-2xl text-center"
        style={{
          backgroundColor: "var(--panel)",
          border: "1px solid var(--border)",
          margin: "0 24px 24px 24px",
        }}
      >
        <h3
          className="text-2xl font-bold mb-4"
          style={{ color: "var(--fg)" }}
        >
          Interesse geweckt?
        </h3>
        <p className="mb-6" style={{ color: "var(--muted)" }}>
          Erfahre mehr über unsere Gruppen und das Eventstudio.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-full font-semibold transition-all duration-300"
            style={{
              backgroundColor: "var(--accent)",
              color: "#000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "drop-shadow(0 8px 20px rgba(46,196,198,0.3))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            Zur Startseite →
          </Link>
          <Link
            href="/gruppen/little-joys"
            className="px-6 py-3 rounded-full font-semibold transition-all duration-300"
            style={{
              backgroundColor: "rgba(46,196,198,0.1)",
              color: "var(--accent)",
              border: "1px solid rgba(46,196,198,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(46,196,198,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(46,196,198,0.1)";
            }}
          >
            Unsere Gruppen
          </Link>
        </div>
      </section>
    </div>
  );
}

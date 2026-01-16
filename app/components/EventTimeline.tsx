"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Music } from "lucide-react";
import { formatDateGerman, getGroupBadgeInfo, getCategoryColor } from "../../lib/events";
import type { Event as EventType } from "../../lib/supabase";

export interface EventTimelineProps {
  events: EventType[];
  variant?: "compact" | "full";
  showYear?: boolean;
}

export default function EventTimeline({
  events,
  variant = "full",
  showYear = false,
}: EventTimelineProps) {
  const isCompact = variant === "compact";

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--muted)" }}>Keine Termine vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div
        className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 lg:w-0.5"
        style={{
          background:
            "linear-gradient(180deg, var(--accent), transparent, var(--accent))",
          opacity: 0.2,
        }}
      ></div>

      {/* Events list */}
      <div className="space-y-12 lg:space-y-16">
        {events.map((event, idx) => (
          <EventCard
            key={event.id}
            event={event}
            index={idx}
            isCompact={isCompact}
            showYear={showYear}
            isAlternate={idx % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}

interface EventCardProps {
  event: EventType;
  index: number;
  isCompact: boolean;
  showYear: boolean;
  isAlternate: boolean;
}

function EventCard({
  event,
  index,
  isCompact,
  showYear,
  isAlternate,
}: EventCardProps) {
  const categoryColor = getCategoryColor(event.category);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    >
      {/* Timeline dot with glow */}
      <motion.div
        className="absolute left-0 lg:left-1/2 top-4 w-3 h-3 lg:w-4 lg:h-4 rounded-full transform lg:-translate-x-1/2 lg:translate-x-1/2"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 0 4px var(--bg), 0 0 12px rgba(46,196,198,0.4)",
        }}
        whileHover={{
          scale: 1.3,
          boxShadow: "0 0 0 4px var(--bg), 0 0 24px rgba(46,196,198,0.7)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Event card container - alternating layout */}
      <div className={`lg:flex lg:gap-8 ${isAlternate ? "lg:flex-row-reverse" : ""}`}>
        {/* Spacer for desktop layout */}
        <div className="hidden lg:block lg:w-1/2" />

        {/* Card content */}
        <div className="ml-16 lg:ml-0 lg:w-1/2">
          <motion.div
            className="p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.5)",
              borderColor: "rgba(46,196,198,0.25)",
              borderWidth: "1px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(46,196,198,0.1)",
            }}
            whileHover={{
              borderColor: "rgba(46,196,198,0.5)",
              boxShadow: "0 12px 40px rgba(46,196,198,0.15), inset 0 1px 1px rgba(46,196,198,0.15)",
            }}
          >
            {/* Date chip with icon */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                backgroundColor: "rgba(46,196,198,0.1)",
                color: "var(--accent)",
              }}
            >
              <Calendar size={14} />
              <span>{formatDateGerman(event.date, showYear)}</span>
              {event.time && <span>·</span>}
              {event.time && <span>{event.time}</span>}
            </div>

            {/* Title */}
            <h3
              className={`${isCompact ? "text-lg" : "text-xl"} font-bold leading-tight mb-2`}
              style={{ color: "var(--fg)" }}
            >
              {event.title}
            </h3>

            {/* Note subtitle (optional) */}
            {event.note && !isCompact && (
              <p className="text-sm mb-3" style={{ color: "var(--accent)" }}>
                {event.note}
              </p>
            )}

            {/* Location with icon */}
            <p className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--muted)" }}>
              <MapPin size={14} style={{ color: "var(--accent)" }} />
              <span>{event.location}, {event.city}</span>
            </p>

            {/* Category badge */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: categoryColor.bg,
                  color: categoryColor.text,
                }}
              >
                {event.category}
              </span>

              {/* Group badges */}
              {event.groups &&
                event.groups.length > 0 &&
                !isCompact &&
                event.groups.map((groupSlug) => {
                  const groupInfo = getGroupBadgeInfo(groupSlug as any);
                  return (
                    <span
                      key={groupSlug}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: groupInfo.color,
                        color: "var(--accent)",
                      }}
                    >
                      {groupInfo.label}
                    </span>
                  );
                })}
            </div>

            {/* Link if exists */}
            {event.href && (
              <Link
                href={event.href}
                className="inline-flex items-center text-sm font-semibold transition-all duration-300"
                style={{ color: "var(--accent)" }}
              >
                Details →
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

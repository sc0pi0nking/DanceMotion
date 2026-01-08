"use client";
import Link from "next/link";
import React from "react";
import type { Tile } from "../../lib/site-data";

export default function TileCard({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className="group block tile-card rounded-lg p-6">
      <div className="flex h-full flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
            {tile.title}
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {tile.shortDescription}
          </p>
        </div>
        <div className="mt-6">
          <span className="inline-block rounded-full px-3 py-1 text-sm" style={{ color: "var(--accent)" }}>
            Mehr erfahren →
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import type { Tile } from "../../lib/site-data";

export default function TileCard({ tile, index }: { tile: Tile; index?: number }) {
  const style: React.CSSProperties = { ['--idx' as any]: index ?? 0 };

  return (
    <Link href={tile.href} className="group block tile-card" style={style}>
      <div className="tile-card-content relative" aria-hidden={false}>
        {/* Logo area (top-left) */}
        {tile.logo && (
          <div className="mb-4">
            <img 
              src={tile.logo} 
              alt={`${tile.title} logo`}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        
        <div className="flex h-full flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
              {tile.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {tile.shortDescription}
            </p>
          </div>
          <div className="mt-6">
            <span className="inline-block rounded-full px-4 py-2 text-sm transition" style={{ color: "var(--accent)", backgroundColor: "rgba(46,196,198,0.08)", border: "1px solid var(--accent)" }}>
              Mehr erfahren →
            </span>
          </div>
        </div>
        <div className="stage-rail" aria-hidden="true" />
      </div>
    </Link>
  );
}

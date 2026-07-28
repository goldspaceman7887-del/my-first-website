"use client";

import { useEffect, useState } from "react";
import { seasonForDate, seasonMeta, type Season } from "@/lib/mock-data";

// Computed client-side from the viewer's real current date on mount (not
// baked in at static-export build time, so it stays accurate) — see
// docs/11-living-ecosystem-redesign.md §8. Renders nothing until mounted to
// avoid a server/client mismatch, since a static export has no request-time
// date to render against.
export function SeasonalBadge({ className }: { className?: string }) {
  const [season, setSeason] = useState<Season | null>(null);

  useEffect(() => {
    setSeason(seasonForDate(new Date()));
  }, []);

  if (!season) return null;
  const meta = seasonMeta[season];

  return (
    <span className={className} style={{ color: meta.accent }}>
      <span aria-hidden="true">{meta.emoji}</span> {meta.label} · {meta.labelJa}
    </span>
  );
}

/** Applies a faint seasonal color wash behind decorative surfaces only — never data visuals. */
export function SeasonalWash({ children, className }: { children: React.ReactNode; className?: string }) {
  const [season, setSeason] = useState<Season | null>(null);

  useEffect(() => {
    setSeason(seasonForDate(new Date()));
  }, []);

  const accent = season ? seasonMeta[season].accent : "#3D9A5C";

  return (
    <section
      className={className}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 100% 0%, ${accent}14 0%, transparent 60%)`,
      }}
    >
      {children}
    </section>
  );
}

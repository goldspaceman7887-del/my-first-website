"use client";

import { useEffect, useState } from "react";
import { activityStream } from "@/lib/mock-data";

// Rotates through the mock activity feed to feel live without a real
// WebSocket/SSE connection (see docs/11-living-ecosystem-redesign.md §7 for
// what powers this for real once the backend exists).
export function ActivityStream({ limit = 6 }: { limit?: number }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % activityStream.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const visible = Array.from({ length: Math.min(limit, activityStream.length) }, (_, i) => activityStream[(offset + i) % activityStream.length]);

  return (
    <div className="rounded-card border border-forest-900/10 bg-cream-100 p-5 dark:bg-forest-900/30">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-forest-700" />
        </span>
        <h3 className="font-display text-sm font-semibold text-forest-900">Happening now</h3>
      </div>
      <ul className="mt-3 space-y-2.5">
        {visible.map((event) => (
          <li key={event.id} className="flex items-start gap-2.5 text-sm text-forest-900/80">
            <span aria-hidden="true">{event.icon}</span>
            <span className="flex-1">{event.text}</span>
            <span className="flex-none text-xs text-forest-900/40">{event.timeAgo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

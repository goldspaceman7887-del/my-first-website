"use client";

import { stations } from "@/lib/mock-data";
import { SIM_EQUIVALENT_SEED_CEILING, type SimTotals } from "@/lib/simulation";

// Same stylized, non-literal Tokyo outline as components/tokyo-heatmap.tsx —
// station dot positions (mapX/mapY) are reused here purely as neutral
// geography. Dot size/color reflects this sandbox's own simulated numbers,
// never the real station's live data.
const LANDMASS_PATH =
  "M10,20 C25,8 45,4 60,9 C78,13 93,24 90,41 C88,54 97,59 92,71 C88,84 70,92 55,96 " +
  "C42,99 29,93 25,83 C14,86 4,77 6,61 C7,49 1,44 5,34 C7,26 2,24 10,20 Z";

export function SimulatorMap({
  totalsBySlug,
  selectedSlug,
  onSelect,
}: {
  totalsBySlug: Record<string, SimTotals>;
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="rounded-card border border-forest-900/10 bg-cream-100 p-4 dark:bg-forest-900/30">
      <svg viewBox="0 0 100 100" role="img" aria-label="Tap a spot on the map to plant or import ad results there" className="w-full">
        <path d={LANDMASS_PATH} fill="var(--leaf-soft, #DCF3E1)" stroke="var(--accent, #1F6B3B)" strokeOpacity="0.25" strokeWidth="0.6" />

        {stations.map((s) => {
          const simTotals = totalsBySlug[s.slug];
          const seedCount = simTotals?.equivalentSeedCount ?? 0;
          const hasSim = seedCount > 0;
          const radius = 2 + Math.sqrt(seedCount / Math.max(1, SIM_EQUIVALENT_SEED_CEILING)) * 6;
          const selected = s.slug === selectedSlug;

          return (
            <g key={s.slug}>
              <circle
                cx={s.mapX}
                cy={s.mapY}
                r={selected ? radius + 1.4 : radius}
                fill={hasSim ? "#E8934B" : "#1F6B3B"}
                fillOpacity={hasSim ? 0.55 : 0.35}
                stroke={selected ? "#E8934B" : "#FBF7EE"}
                strokeWidth={selected ? 0.9 : 0.5}
                className="cursor-pointer transition-all"
                onClick={() => onSelect(s.slug)}
              />
              <text
                x={s.mapX}
                y={s.mapY - radius - 2}
                textAnchor="middle"
                fontSize="3.1"
                fontWeight={selected ? 800 : 600}
                fill="var(--ink, #14432A)"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", pointerEvents: "none" }}
              >
                {s.name}
              </text>
              {hasSim && (
                <text
                  x={s.mapX}
                  y={s.mapY + 1}
                  textAnchor="middle"
                  fontSize="2.6"
                  fontWeight={700}
                  fill="#FBF7EE"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", pointerEvents: "none" }}
                >
                  {seedCount}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-[11px] text-forest-900/50">
        Tap any spot to plant or import ad results there. Orange = you&apos;ve simulated seeds here; the number is your sandbox&apos;s equivalent seed count at that spot, not real data.
      </p>
    </div>
  );
}

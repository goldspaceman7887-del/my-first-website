"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { stations } from "@/lib/mock-data";

// Stylized, non-literal outline of the Tokyo area — a loose coastal blob, not a
// real projection. mapX/mapY on each station (lib/mock-data.ts) place dots on
// this same 0-100 viewBox by relative position (west/east, north/south), not
// by true lat/lng.
const LANDMASS_PATH =
  "M10,20 C25,8 45,4 60,9 C78,13 93,24 90,41 C88,54 97,59 92,71 C88,84 70,92 55,96 " +
  "C42,99 29,93 25,83 C14,86 4,77 6,61 C7,49 1,44 5,34 C7,26 2,24 10,20 Z";

type Layer = "demand" | "growth";

// Demand bands per docs/11-living-ecosystem-redesign.md §4 — Blue/Yellow/Orange/Red.
function demandColor(score: number) {
  if (score >= 75) return "#B54A3C"; // red — very high demand
  if (score >= 50) return "#E8A24B"; // orange — high demand
  if (score >= 25) return "#E8C24B"; // yellow — moderate demand
  return "#6FB7DE"; // blue — low demand
}

export function TokyoHeatMap() {
  const [layer, setLayer] = useState<Layer>("demand");
  const maxDemand = Math.max(...stations.map((s) => s.demandScore));
  const maxGrowth = Math.max(...stations.map((s) => s.growthScore));

  return (
    <div className="rounded-card border border-forest-900/10 bg-cream-100 p-5 dark:bg-forest-900/30">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-forest-900">Tokyo heat map</h3>
          <p className="text-xs text-forest-900/60">
            {layer === "demand"
              ? "熱意マップ — where people most want to practice, funded or not"
              : "成長マップ — what's actually been built so far"}
          </p>
        </div>
        <div className="flex rounded-full bg-cream-50 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLayer("demand")}
            className={cn("rounded-full px-3 py-1.5 transition-colors", layer === "demand" ? "bg-forest-700 text-cream-50" : "text-forest-900/60 hover:text-forest-900")}
          >
            Demand
          </button>
          <button
            type="button"
            onClick={() => setLayer("growth")}
            className={cn("rounded-full px-3 py-1.5 transition-colors", layer === "growth" ? "bg-forest-700 text-cream-50" : "text-forest-900/60 hover:text-forest-900")}
          >
            Growth
          </button>
        </div>
      </div>

      {layer === "demand" ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-forest-900/60">
          <Legend color="#6FB7DE" label="Low" />
          <Legend color="#E8C24B" label="Moderate" />
          <Legend color="#E8A24B" label="High" />
          <Legend color="#B54A3C" label="Very high" />
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-forest-900/60">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#8FD19E" }} aria-hidden="true" />
          low growth
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#14432A" }} aria-hidden="true" />
          ancient forest
        </div>
      )}

      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={layer === "demand" ? "Heat map of Tokyo showing demand to practice English at each station" : "Map of Tokyo showing how built-out each station's field is"}
        className="mt-4 w-full"
      >
        <defs>
          <filter id="heat-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
          {stations.map((s) => (
            <radialGradient key={s.slug} id={`heat-${s.slug}-${layer}`} cx="50%" cy="50%" r="50%">
              {layer === "demand" ? (
                <>
                  <stop offset="0%" stopColor={demandColor(s.demandScore)} stopOpacity={0.2 + 0.55 * (s.demandScore / maxDemand)} />
                  <stop offset="100%" stopColor={demandColor(s.demandScore)} stopOpacity="0" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#1F6B3B" stopOpacity={0.15 + 0.55 * (s.growthScore / maxGrowth)} />
                  <stop offset="100%" stopColor="#8FD19E" stopOpacity="0" />
                </>
              )}
            </radialGradient>
          ))}
        </defs>

        <path d={LANDMASS_PATH} fill="var(--leaf-soft, #DCF3E1)" stroke="var(--accent, #1F6B3B)" strokeOpacity="0.25" strokeWidth="0.6" />

        <g filter="url(#heat-blur)">
          {stations.map((s) => (
            <circle
              key={s.slug}
              cx={s.mapX}
              cy={s.mapY}
              r={7 + ((layer === "demand" ? s.demandScore : s.growthScore) / 100) * 11}
              fill={`url(#heat-${s.slug}-${layer})`}
            />
          ))}
        </g>

        {stations.map((s) => (
          <g key={s.slug}>
            <Link href={`/map/${s.slug}`}>
              <circle cx={s.mapX} cy={s.mapY} r="1.6" fill="#1F6B3B" stroke="#FBF7EE" strokeWidth="0.5" />
              <title>
                {s.name} ({s.nameJa}) — demand {s.demandScore}/100, growth {s.growthScore}/100, {s.activeSeedCount} seeds planted
              </title>
            </Link>
            <text
              x={s.mapX}
              y={s.mapY - 3}
              textAnchor="middle"
              fontSize="3.1"
              fontWeight={700}
              fill="var(--ink, #14432A)"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", pointerEvents: "none" }}
            >
              {s.name}
            </text>
          </g>
        ))}
      </svg>

      <p className="mt-3 text-[11px] text-forest-900/50">
        {layer === "demand"
          ? "Red/orange with little funding = a real opportunity. Dot position is a stylized layout, not a literal map."
          : "Circle size and warmth = how much has actually been built. Tap a station for its full harvest field."}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

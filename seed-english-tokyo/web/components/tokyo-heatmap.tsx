import Link from "next/link";
import { stations } from "@/lib/mock-data";

// Stylized, non-literal outline of the Tokyo area — a loose coastal blob, not a
// real projection. mapX/mapY on each station (lib/mock-data.ts) place dots on
// this same 0-100 viewBox by relative position (west/east, north/south), not
// by true lat/lng.
const LANDMASS_PATH =
  "M10,20 C25,8 45,4 60,9 C78,13 93,24 90,41 C88,54 97,59 92,71 C88,84 70,92 55,96 " +
  "C42,99 29,93 25,83 C14,86 4,77 6,61 C7,49 1,44 5,34 C7,26 2,24 10,20 Z";

export function TokyoHeatMap() {
  const maxDemand = Math.max(...stations.map((s) => s.demandScore));

  return (
    <div className="rounded-card border border-forest-900/10 bg-cream-100 p-5 dark:bg-forest-900/30">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-forest-900">Demand heat map</h3>
          <p className="text-xs text-forest-900/60">熱意マップ — where people are gathering and asking to practice</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-forest-900/60">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#E8A24B" }} aria-hidden="true" />
          low
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#C4522A" }} aria-hidden="true" />
          high demand
        </div>
      </div>

      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Heat map of Tokyo showing demand to practice English at each station"
        className="mt-4 w-full"
      >
        <defs>
          <filter id="heat-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
          {stations.map((s) => (
            <radialGradient key={s.slug} id={`heat-${s.slug}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C4522A" stopOpacity={0.15 + 0.55 * (s.demandScore / maxDemand)} />
              <stop offset="100%" stopColor="#E8A24B" stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <path d={LANDMASS_PATH} fill="var(--leaf-soft, #DCF3E1)" stroke="var(--accent, #1F6B3B)" strokeOpacity="0.25" strokeWidth="0.6" />

        <g filter="url(#heat-blur)">
          {stations.map((s) => (
            <circle key={s.slug} cx={s.mapX} cy={s.mapY} r={7 + (s.demandScore / 100) * 11} fill={`url(#heat-${s.slug})`} />
          ))}
        </g>

        {stations.map((s) => (
          <g key={s.slug}>
            <Link href={`/map/${s.slug}`}>
              <circle cx={s.mapX} cy={s.mapY} r="1.6" fill="#1F6B3B" stroke="#FBF7EE" strokeWidth="0.5" />
              <title>
                {s.name} ({s.nameJa}) — demand {s.demandScore}/100, {s.activeSeedCount} seeds planted
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
        Circle size and warmth = demand to practice right now. Dot position is a stylized layout, not a literal map — tap a station for its full harvest field.
      </p>
    </div>
  );
}

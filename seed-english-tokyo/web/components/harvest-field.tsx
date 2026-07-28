"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FieldStatus, GrowthStage } from "@/lib/mock-data";
import { ToriiIcon } from "@/components/motifs/torii-icon";

// Deterministic PRNG (mulberry32) seeded from the station slug so server and
// client render identical scatter positions — no hydration mismatch.
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const STAGE_ICON: Record<GrowthStage, string> = {
  bare_soil: "🌱",
  seedling: "🌱",
  sprout: "🌿",
  sapling: "🌿",
  tree: "🌳",
  forest: "🌳",
  ancient_forest: "🌲",
};

function densityFor(count: number, maxCount: number) {
  if (count <= 0) return 0;
  const ratio = Math.sqrt(count / Math.max(1, maxCount));
  return Math.max(1, Math.round(ratio * 42));
}

export interface OwnedSeedMarker {
  id: string;
  seedNumber: number;
}

export function HarvestField({
  slug,
  count,
  maxCount,
  stage,
  className,
  height = 160,
  interactive = false,
  ownedSeeds = [],
  fieldName,
  fieldNameJa,
  fundingRaisedYen,
  donorCount,
  fieldStatus,
}: {
  slug: string;
  count: number;
  maxCount: number;
  stage: GrowthStage;
  className?: string;
  height?: number;
  /** Enables click-to-inspect. Only pass true when this field is NOT already nested inside a <Link>/<a> — clickable elements can't nest inside an anchor. */
  interactive?: boolean;
  /** Seeds this account actually owns at this field — these render as highlighted markers linking straight to the real seed page, never fabricated. */
  ownedSeeds?: OwnedSeedMarker[];
  fieldName?: string;
  fieldNameJa?: string;
  fundingRaisedYen?: number;
  donorCount?: number;
  fieldStatus?: FieldStatus;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const n = densityFor(count, maxCount);
  const rand = seededRandom(slug);
  const icon = STAGE_ICON[stage];

  const items = Array.from({ length: n }, (_, i) => {
    const x = 4 + rand() * 92;
    const y = 10 + rand() * 82;
    const size = 12 + rand() * 14;
    const rotate = rand() * 24 - 12;
    const owner = i < ownedSeeds.length ? ownedSeeds[i] : undefined;
    return { key: i, x, y, size, rotate, owner };
  });

  return (
    <div>
      <div
        className={cn("relative overflow-hidden rounded-xl border", className)}
        style={{
          height,
          background: "linear-gradient(180deg, var(--surface, #F3ECDA) 0%, var(--earth-soft, rgba(156,123,79,0.14)) 100%)",
          borderColor: "var(--border, rgba(20,67,42,0.1))",
        }}
        role="img"
        aria-label={count > 0 ? `Harvest field with ${count} seeds planted` : "Bare field — no seeds planted yet"}
      >
        {/* rice-paddy plot grid: embankment lines, inspired by Japanese tanada terraces + GitHub's contribution grid */}
        <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 14}%`} x2="100%" y2={`${(i + 1) * 14}%`} stroke="var(--earth, #9C7B4F)" strokeWidth="1" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 16.6}%`} y1="0" x2={`${(i + 1) * 16.6}%`} y2="100%" stroke="var(--earth, #9C7B4F)" strokeWidth="1" />
          ))}
        </svg>

        {items.map((it) => {
          const style: React.CSSProperties = {
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: `${it.size}px`,
            transform: `rotate(${it.rotate}deg)`,
            animationDelay: `${(it.key % 7) * 0.3}s`,
          };

          if (it.owner) {
            return (
              <Link
                key={it.key}
                href={`/seeds/${it.owner.id}`}
                className="absolute select-none animate-sway rounded-full ring-2 ring-sunset-400 ring-offset-1"
                style={style}
                title={`Your Seed #${it.owner.seedNumber} — view it`}
              >
                {icon}
              </Link>
            );
          }

          if (interactive) {
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => setShowInfo(true)}
                className="absolute select-none animate-sway cursor-pointer bg-transparent p-0 leading-none"
                style={style}
                aria-label="View this field's stats"
              >
                {icon}
              </button>
            );
          }

          return (
            <span key={it.key} className="absolute select-none animate-sway" style={style} aria-hidden="true">
              {icon}
            </span>
          );
        })}

        {count <= 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ToriiIcon className="h-10 w-12 text-torii-500/40" />
            <span className="rounded-full bg-cream-50/80 px-3 py-1 text-xs font-semibold text-earth-600 dark:bg-forest-900/60">
              Bare field · 空き地
            </span>
          </div>
        )}

        {ownedSeeds.length > 0 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-cream-50/90 px-2.5 py-1 text-[11px] font-semibold text-forest-700 dark:bg-forest-900/70">
            🌟 {ownedSeeds.length} of your seed{ownedSeeds.length === 1 ? "" : "s"} here
          </div>
        )}
      </div>

      {interactive && showInfo && (
        <div className="mt-3 rounded-xl border border-forest-900/10 bg-cream-100 p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-forest-900">
                🌲 One of {count.toLocaleString()} seeds growing{fieldName ? ` in ${fieldName}` : ""}
              </p>
              {fieldNameJa && <p className="text-xs text-forest-900/50">{fieldNameJa}</p>}
            </div>
            <button type="button" onClick={() => setShowInfo(false)} aria-label="Close" className="text-forest-900/40 hover:text-forest-900">
              ✕
            </button>
          </div>
          <p className="mt-2 text-forest-900/70">
            {typeof fundingRaisedYen === "number" && <>Funded by {donorCount ?? "several"} supporters, ¥{fundingRaisedYen.toLocaleString()} raised so far. </>}
            Every tree here represents real activity, not this one specifically — individual seed records aren&apos;t public yet, but{" "}
            <Link href="/seeds/plant" className="font-semibold text-forest-700 underline">
              your own seeds
            </Link>{" "}
            always show up highlighted right on this field.
          </p>
        </div>
      )}
    </div>
  );
}

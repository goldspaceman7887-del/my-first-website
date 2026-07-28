import { cn } from "@/lib/utils";
import type { GrowthStage } from "@/lib/mock-data";
import { ToriiIcon } from "@/components/motifs/torii-icon";

// Deterministic PRNG (mulberry32) seeded from the station slug so server and
// client render identical scatter positions — no hydration mismatch, no
// client JS required.
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
  tree: "🌿",
  forest: "🌳",
};

function densityFor(count: number, maxCount: number) {
  if (count <= 0) return 0;
  const ratio = Math.sqrt(count / Math.max(1, maxCount));
  return Math.max(1, Math.round(ratio * 42));
}

export function HarvestField({
  slug,
  count,
  maxCount,
  stage,
  className,
  height = 160,
}: {
  slug: string;
  count: number;
  maxCount: number;
  stage: GrowthStage;
  className?: string;
  height?: number;
}) {
  const n = densityFor(count, maxCount);
  const rand = seededRandom(slug);
  const icon = STAGE_ICON[stage];

  const items = Array.from({ length: n }, (_, i) => {
    const x = 4 + rand() * 92;
    const y = 10 + rand() * 82;
    const size = 12 + rand() * 14;
    const rotate = rand() * 24 - 12;
    return { key: i, x, y, size, rotate };
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border",
        className
      )}
      style={{
        height,
        background: "linear-gradient(180deg, var(--surface, #F3ECDA) 0%, var(--earth-soft, rgba(156,123,79,0.14)) 100%)",
        borderColor: "var(--border, rgba(20,67,42,0.1))",
      }}
      role="img"
      aria-label={count > 0 ? `Harvest field with ${count} seeds planted` : "Bare field — no seeds planted yet"}
    >
      {/* soil furrow lines for texture */}
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1="0" y1={`${(i + 1) * 14}%`} x2="100%" y2={`${(i + 1) * 14}%`} stroke="var(--earth, #9C7B4F)" strokeWidth="1" />
        ))}
      </svg>

      {items.map((it) => (
        <span
          key={it.key}
          className="absolute select-none animate-sway"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: `${it.size}px`,
            transform: `rotate(${it.rotate}deg)`,
            animationDelay: `${(it.key % 7) * 0.3}s`,
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      ))}

      {count <= 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <ToriiIcon className="h-10 w-12 text-torii-500/40" />
          <span className="rounded-full bg-cream-50/80 px-3 py-1 text-xs font-semibold text-earth-600 dark:bg-forest-900/60">
            Bare field · 空き地
          </span>
        </div>
      )}
    </div>
  );
}

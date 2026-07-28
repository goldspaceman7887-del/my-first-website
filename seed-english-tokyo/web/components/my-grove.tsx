import Link from "next/link";
import type { Seed } from "@/lib/mock-data";
import { seedHref } from "@/lib/local-seeds";

// Deterministic PRNG (mulberry32), same approach as harvest-field.tsx — keyed
// off each seed's own id so a given seed always lands in the same spot.
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

function iconFor(seed: Seed) {
  if (seed.status === "thriving" || seed.treeProgressPct >= 90) return "🌲";
  if (seed.treeProgressPct >= 60) return "🌳";
  if (seed.treeProgressPct >= 25) return "🌿";
  return "🌱";
}

/** A personal, visual version of the harvest field — every tree here is a real seed you own, sized by how grown it is, clickable straight to its page. */
export function MyGrove({ seeds }: { seeds: Seed[] }) {
  if (seeds.length === 0) return null;

  const items = seeds.map((seed) => {
    const rand = seededRandom(seed.id);
    const x = 6 + rand() * 86;
    const y = 16 + rand() * 64;
    const size = 22 + (seed.treeProgressPct / 100) * 26;
    const rotate = rand() * 16 - 8;
    return { seed, x, y, size, rotate };
  });

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-forest-900/10"
      style={{
        height: 200,
        background: "linear-gradient(180deg, var(--surface, #F3ECDA) 0%, var(--earth-soft, rgba(156,123,79,0.14)) 100%)",
      }}
      role="img"
      aria-label={`Your grove — ${seeds.length} seed${seeds.length === 1 ? "" : "s"} you've planted`}
    >
      {items.map(({ seed, x, y, size, rotate }) => (
        <Link
          key={seed.id}
          href={seedHref(seed)}
          className="group absolute select-none animate-sway leading-none"
          style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}px`, transform: `rotate(${rotate}deg)` }}
        >
          <span aria-hidden="true">{iconFor(seed)}</span>
          <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-max max-w-[200px] -translate-x-1/2 scale-0 whitespace-nowrap rounded-lg bg-forest-900 px-2 py-1 text-[11px] font-sans text-cream-50 opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
            Seed #{seed.seedNumber} · {seed.station} · {seed.treeProgressPct}% grown
          </span>
        </Link>
      ))}
    </div>
  );
}

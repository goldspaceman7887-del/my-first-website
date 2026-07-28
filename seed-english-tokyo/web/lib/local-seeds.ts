import type { Seed } from "@/lib/mock-data";

// Static export has no backend/database — a "planted" seed can't be written to a
// server. Instead it's saved to this browser's localStorage, so it's real data
// (what you actually entered), just persisted client-side instead of
// server-side. Clearly a demo mechanic, but it means planting a seed actually
// shows up in your forest, on the map, and in the citywide totals afterward.
const STORAGE_KEY = "seed-english-tokyo:planted-seeds:v1";

export function loadLocalSeeds(): Seed[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Seed[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalSeed(seed: Seed) {
  if (typeof window === "undefined") return;
  const existing = loadLocalSeeds();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([seed, ...existing]));
}

/** Seeds you just planted don't have a pre-generated static page (static export can't build a page for an id that didn't exist at build time), so they route through the id-in-query-string view instead of the normal /seeds/[id] path. */
export function seedHref(seed: Pick<Seed, "id">) {
  return seed.id.startsWith("local-") ? `/seeds/view?id=${seed.id}` : `/seeds/${seed.id}`;
}

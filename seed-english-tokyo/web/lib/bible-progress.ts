const STORAGE_KEY = "seed-tokyo:bible-progress:v1";

/** day (1-21) -> ISO date string it was marked read. */
export type BibleProgress = Record<number, string>;

export function loadBibleProgress(): BibleProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as BibleProgress) : {};
  } catch {
    return {};
  }
}

export function markDayRead(day: number): BibleProgress {
  if (typeof window === "undefined") return {};
  const progress = loadBibleProgress();
  progress[day] = new Date().toISOString().slice(0, 10);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function unmarkDayRead(day: number): BibleProgress {
  if (typeof window === "undefined") return {};
  const progress = loadBibleProgress();
  delete progress[day];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

/** Consecutive calendar days (ending at the most recent one) with at least one day marked read. */
export function computeStreak(progress: BibleProgress): number {
  const dates = Array.from(new Set(Object.values(progress))).sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const cur = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

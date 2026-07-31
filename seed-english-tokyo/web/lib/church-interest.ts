export interface ChurchInterest {
  id: string;
  churchSlug: string;
  churchName: string;
  date: string;
}

const STORAGE_KEY = "seed-tokyo:church-interest:v1";

export function loadChurchInterest(): ChurchInterest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChurchInterest[]) : [];
  } catch {
    return [];
  }
}

export function saveChurchInterest(entry: ChurchInterest) {
  if (typeof window === "undefined") return;
  const existing = loadChurchInterest();
  if (existing.some((e) => e.churchSlug === entry.churchSlug)) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
}

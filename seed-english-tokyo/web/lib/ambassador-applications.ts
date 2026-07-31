export interface AmbassadorApplication {
  id: string;
  universitySlug: string;
  universityName: string;
  name: string | null;
  contact: string | null;
  date: string;
}

const STORAGE_KEY = "seed-tokyo:ambassador-applications:v1";

export function loadAmbassadorApplications(): AmbassadorApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AmbassadorApplication[]) : [];
  } catch {
    return [];
  }
}

export function saveAmbassadorApplication(entry: AmbassadorApplication) {
  if (typeof window === "undefined") return;
  const existing = loadAmbassadorApplications();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
}

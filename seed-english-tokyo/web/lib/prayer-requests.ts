export interface PrayerRequest {
  id: string;
  text: string;
  name: string | null;
  date: string;
}

const STORAGE_KEY = "seed-tokyo:prayer-requests:v1";

export function loadPrayerRequests(): PrayerRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PrayerRequest[]) : [];
  } catch {
    return [];
  }
}

export function savePrayerRequest(request: PrayerRequest) {
  if (typeof window === "undefined") return;
  const existing = loadPrayerRequests();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([request, ...existing]));
}

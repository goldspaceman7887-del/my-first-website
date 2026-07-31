export interface VolunteerApplication {
  id: string;
  name: string | null;
  contact: string | null;
  interests: string[];
  availability: string;
  date: string;
}

const STORAGE_KEY = "seed-tokyo:volunteer-applications:v1";

export function loadVolunteerApplications(): VolunteerApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VolunteerApplication[]) : [];
  } catch {
    return [];
  }
}

export function saveVolunteerApplication(entry: VolunteerApplication) {
  if (typeof window === "undefined") return;
  const existing = loadVolunteerApplications();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
}

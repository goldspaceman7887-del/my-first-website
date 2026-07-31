export interface Testimony {
  id: string;
  name: string | null;
  station: string | null;
  title: string;
  body: string;
  date: string;
  seeded: boolean;
}

const STORAGE_KEY = "seed-tokyo:testimonies:v1";

/** Curated example stories shown to everyone — clearly fictional, matching the rest of the platform's demo data. */
export const seededTestimonies: Testimony[] = [
  {
    id: "seed-1",
    name: "Haruto",
    station: "Shibuya",
    title: "I came for the free English practice. I stayed for the questions.",
    body: "I joined a conversation group two years ago just to improve my English before a job interview. Someone in the group mentioned they were reading the Bible and I got curious. It took almost a year of just asking questions before I actually believed any of it — nobody rushed me.",
    date: "2027-03-14",
    seeded: true,
  },
  {
    id: "seed-2",
    name: "Anonymous",
    station: "Shinjuku",
    title: "I didn't expect anyone to actually pray for me.",
    body: "I sent a prayer request anonymously during a hard month. A few weeks later someone from a local group reached out gently, no pressure at all. That mattered more than I can explain.",
    date: "2027-04-02",
    seeded: true,
  },
  {
    id: "seed-3",
    name: "Mei",
    station: "Ikebukuro",
    title: "My family isn't religious. I was terrified to tell them.",
    body: "I found a small group near Ikebukuro station where nobody made me feel strange for asking basic questions. Telling my parents is still something I'm working up to, but having a place to be honest about it first has made all the difference.",
    date: "2027-05-11",
    seeded: true,
  },
];

export function loadTestimonies(): Testimony[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Testimony[]) : [];
  } catch {
    return [];
  }
}

export function saveTestimony(entry: Testimony) {
  if (typeof window === "undefined") return;
  const existing = loadTestimonies();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
}

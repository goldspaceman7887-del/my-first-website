export interface ConnectionRequest {
  id: string;
  method: "chat" | "video" | "in_person";
  topic: string;
  name: string | null;
  contact: string | null;
  date: string;
}

const STORAGE_KEY = "seed-tokyo:connection-requests:v1";

export function loadConnectionRequests(): ConnectionRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ConnectionRequest[]) : [];
  } catch {
    return [];
  }
}

export function saveConnectionRequest(request: ConnectionRequest) {
  if (typeof window === "undefined") return;
  const existing = loadConnectionRequests();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([request, ...existing]));
}

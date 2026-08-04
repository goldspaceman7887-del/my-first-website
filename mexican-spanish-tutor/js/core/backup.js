// SAVING PROGRESS.
//
// Progress already writes to localStorage on every change, but that's
// invisible and it's tied to one browser on one device — clearing site data,
// switching to a phone, or opening a private window all lose it. So this adds
// three explicit things on top:
//
//   1. a visible "last saved" timestamp, so you can see it's working
//   2. a backup FILE you can download and re-import
//   3. a backup CODE you can copy/paste to move progress between devices
//
// The code is just the same JSON, compacted and base64'd, so it survives being
// pasted into a note or a message without a file attachment.

import { store, todayISO } from "./storage.js";

export function lastSavedAt() {
  return store.state.profile.lastSavedAt || null;
}

export function markSaved() {
  store.state.profile.lastSavedAt = Date.now();
  store.save();
}

export function describeLastSaved() {
  const t = lastSavedAt();
  if (!t) return "not saved yet";
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  return new Date(t).toLocaleDateString();
}

function snapshot() {
  return store.exportJSON();
}

/** Downloads progress as a .json file. */
export function downloadBackup() {
  const blob = new Blob([snapshot()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `spanish-progress-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  markSaved();
}

// base64 has to survive accented characters and emoji, so encode UTF-8 first.
function utf8ToB64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}
function b64ToUtf8(b64) {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** A pasteable code carrying the whole save. */
export function makeCode() {
  const code = "MXES1:" + utf8ToB64(JSON.stringify(JSON.parse(snapshot())));
  markSaved();
  return code;
}

/**
 * Restores from a code produced by makeCode().
 * Returns { ok, error } — never throws, so callers can just show the message.
 */
export function restoreFromCode(raw) {
  const text = String(raw || "").trim();
  if (!text) return { ok: false, error: "Paste your backup code first." };
  if (!text.startsWith("MXES1:")) {
    return { ok: false, error: "That doesn't look like a backup code — it should start with MXES1:" };
  }
  let json;
  try {
    json = b64ToUtf8(text.slice("MXES1:".length));
  } catch (e) {
    return { ok: false, error: "That code looks damaged — it may have been cut off when copied." };
  }
  return restoreFromJSON(json);
}

/** Restores from raw JSON (the downloaded file). */
export function restoreFromJSON(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { ok: false, error: "That file isn't valid backup data." };
  }
  if (!parsed || typeof parsed !== "object" || !parsed.profile || !parsed.progress) {
    return { ok: false, error: "That file is missing progress data — is it a backup from this app?" };
  }
  try {
    store.importJSON(json);
    markSaved();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Could not load that backup." };
  }
}

/** Small summary so a restore can be confirmed against what was expected. */
export function progressSummary() {
  const p = store.state.profile;
  const g = store.state.progress;
  return {
    xp: p.xp || 0,
    streak: p.streak || 0,
    units: (g.roadmapUnitsCompleted || []).length + (g.roadmapUnitsSkipped || []).length,
    words: Object.keys(g.vocabExposure || {}).length
  };
}

// Duolingo-style hearts (lives): lose one on a wrong answer during a
// lesson, slowly regenerate over time. Kept as a light, non-punitive system
// (no lockouts, no premium upsell) — running out just ends the current
// lesson early with an encouraging message.

import { store } from "./storage.js";

export const MAX_HEARTS = 5;
const REGEN_HOURS = 2; // one heart back every 2 hours
const REGEN_MS = REGEN_HOURS * 3600000;

function ensureHeartsState() {
  if (!store.state.profile.hearts) {
    store.state.profile.hearts = { current: MAX_HEARTS, max: MAX_HEARTS, lastRegenAt: Date.now() };
  }
  return store.state.profile.hearts;
}

function applyRegen(h) {
  if (h.current >= h.max) {
    h.lastRegenAt = Date.now();
    return;
  }
  const elapsedMs = Date.now() - h.lastRegenAt;
  const gained = Math.floor(elapsedMs / REGEN_MS);
  if (gained > 0) {
    h.current = Math.min(h.max, h.current + gained);
    h.lastRegenAt = h.current >= h.max ? Date.now() : h.lastRegenAt + gained * REGEN_MS;
  }
}

export function getHearts() {
  const h = ensureHeartsState();
  applyRegen(h);
  return h;
}

export function loseHeart() {
  const h = getHearts();
  const wasFull = h.current >= h.max;
  h.current = Math.max(0, h.current - 1);
  if (wasFull) h.lastRegenAt = Date.now();
  store.save();
  return h;
}

export function hasHearts() {
  return getHearts().current > 0;
}

export function refillHeartsFully() {
  const h = ensureHeartsState();
  h.current = h.max;
  h.lastRegenAt = Date.now();
  store.save();
  return h;
}

export function minutesUntilNextHeart() {
  const h = getHearts();
  if (h.current >= h.max) return 0;
  const elapsedMs = Date.now() - h.lastRegenAt;
  const remainingMs = REGEN_MS - (elapsedMs % REGEN_MS);
  return Math.max(1, Math.ceil(remainingMs / 60000));
}

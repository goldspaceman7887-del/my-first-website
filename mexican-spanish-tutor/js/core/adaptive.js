// Adaptive difficulty — a thin, bounded layer over existing systems, not a
// new grading subsystem. Reads the last few graded interactions across
// scenarios, conversation, and immersion, and produces two small modifiers:
//   1. whether the NEXT bot turn should auto-slow, beyond the existing
//      manual "?"/"no entiendo" trigger
//   2. a ±1 nudge to the conversation engine's tier bucket, so probe
//      difficulty eases off (or leans in) slightly ahead of the canonical
//      ACTFL level itself moving
//
// Nothing here computes proficiency — that's actflProfile.js's job. This
// only smooths pacing/difficulty turn-to-turn.

import { store } from "./storage.js";

const WINDOW = 8;
const CAP = 20;

export function recordPerformance(kind, outcome, mistakeDensity = 0) {
  const log = store.state.progress.recentPerformance || (store.state.progress.recentPerformance = []);
  log.push({ date: Date.now(), kind, outcome, mistakeDensity });
  if (log.length > CAP) log.shift();
  store.save();
}

function recentWindow() {
  return (store.state.progress.recentPerformance || []).slice(-WINDOW);
}

// Struggling = at least half the recent window was "struggled" or had high
// mistake density. Requires a minimum sample so a single rough answer
// doesn't immediately flip pacing.
export function isRecentlyStruggling() {
  const w = recentWindow();
  if (w.length < 3) return false;
  const struggled = w.filter((e) => e.outcome === "struggled" || e.mistakeDensity >= 0.4).length;
  return struggled / w.length >= 0.5;
}

// -1 = ease off a tier, 0 = no change, +1 = lean harder. Applied as a bias
// on top of the existing 0/1/2 tier bucket, clamped there — never pushes
// outside the bucket's own range.
export function tierBias() {
  const w = recentWindow();
  if (w.length < 4) return 0;
  const good = w.filter((e) => e.outcome === "good" && e.mistakeDensity < 0.15).length;
  if (good / w.length >= 0.75) return 1;
  if (isRecentlyStruggling()) return -1;
  return 0;
}

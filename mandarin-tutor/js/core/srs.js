// SM-2 inspired spaced repetition engine on the fixed interval ladder from
// the tutor spec: New -> 1 -> 3 -> 7 -> 14 -> 30 -> 60 days.

import { store } from "./storage.js";

export const INTERVAL_STEPS = [0, 1, 3, 7, 14, 30, 60]; // days
const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

// quality: 0 = Again, 1 = Hard-fail, 2 = Hard, 3 = Good, 4 = Easy, 5 = Very easy
export function gradeItem(itemId, type, quality) {
  const srs = store.state.srs;
  const now = Date.now();
  let item = srs[itemId];
  if (!item) {
    item = {
      id: itemId,
      type, // "character" | "word" | "sentence" | "dialogue"
      repetition: 0,
      easeFactor: DEFAULT_EASE,
      interval: 0,
      stepIndex: 0,
      nextReview: now,
      lastReview: null,
      correct: 0,
      incorrect: 0,
      history: []
    };
    srs[itemId] = item;
  }

  const isCorrect = quality >= 3;
  if (isCorrect) item.correct += 1;
  else item.incorrect += 1;

  if (!isCorrect) {
    item.repetition = 0;
    item.stepIndex = 0;
    item.easeFactor = Math.max(MIN_EASE, item.easeFactor - 0.2);
    item.interval = INTERVAL_STEPS[0];
  } else {
    item.repetition += 1;
    item.easeFactor = Math.max(
      MIN_EASE,
      item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    if (item.stepIndex < INTERVAL_STEPS.length - 1) {
      item.stepIndex += 1;
      item.interval = INTERVAL_STEPS[item.stepIndex];
    } else {
      item.interval = Math.round(item.interval * item.easeFactor);
    }
  }

  item.lastReview = now;
  item.nextReview = now + Math.max(item.interval, quality === 0 ? 0 : 0.0007) * 86400000;
  item.history.push({ date: now, quality });
  if (item.history.length > 60) item.history.shift();

  store.save();
  return item;
}

export function getItem(itemId) {
  return store.state.srs[itemId] || null;
}

// Marks an item as already known -- drops it straight into the ladder's
// final (60-day) step, the same "long-term memory" bucket a normal item
// only reaches after several successful reviews. This is what "check it
// off into my toolbox" does: it stops the item from being offered as new
// and keeps it out of Review's due queue for a long time, without deleting
// its history the way forgetting it would.
export function markKnown(itemId, type) {
  const srs = store.state.srs;
  const now = Date.now();
  const topStep = INTERVAL_STEPS.length - 1;
  srs[itemId] = {
    id: itemId,
    type,
    repetition: 5,
    easeFactor: DEFAULT_EASE,
    interval: INTERVAL_STEPS[topStep],
    stepIndex: topStep,
    nextReview: now + INTERVAL_STEPS[topStep] * 86400000,
    lastReview: now,
    correct: 1,
    incorrect: 0,
    history: [{ date: now, quality: 5 }]
  };
  store.save();
  return srs[itemId];
}

// Undoes markKnown (or any mastery) -- clears the SRS record so the item
// goes back into the "new" pool and can be learned/reviewed again.
export function forgetItem(itemId) {
  delete store.state.srs[itemId];
  store.save();
}

export function stepLabel(item) {
  if (!item) return "New";
  const days = INTERVAL_STEPS[item.stepIndex];
  if (days === 0) return "New";
  return `${days}d`;
}

export function isDue(itemId) {
  const item = store.state.srs[itemId];
  if (!item) return true; // never studied = due (new)
  return item.nextReview <= Date.now();
}

export function dueItems(type = null) {
  const now = Date.now();
  return Object.values(store.state.srs).filter(
    (i) => i.nextReview <= now && (type ? i.type === type : true)
  );
}

export function overdueItems(type = null) {
  const now = Date.now();
  const oneDay = 86400000;
  return Object.values(store.state.srs).filter(
    (i) => now - i.nextReview > oneDay && (type ? i.type === type : true)
  );
}

export function newItems(allIds, type) {
  const seen = new Set(Object.keys(store.state.srs));
  return allIds.filter((id) => !seen.has(id));
}

export function masteryLevel(itemId) {
  const item = store.state.srs[itemId];
  if (!item) return 0;
  const depthScore = Math.min(1, item.stepIndex / (INTERVAL_STEPS.length - 1));
  const total = item.correct + item.incorrect;
  const accuracy = total > 0 ? item.correct / total : 0;
  return Math.round((depthScore * 0.65 + accuracy * 0.35) * 100);
}

export function isMastered(itemId, threshold = 70) {
  return masteryLevel(itemId) >= threshold;
}

export function retentionRate(type = null) {
  const items = Object.values(store.state.srs).filter((i) => (type ? i.type === type : true));
  if (items.length === 0) return 0;
  const total = items.reduce((s, i) => s + i.correct + i.incorrect, 0);
  const correct = items.reduce((s, i) => s + i.correct, 0);
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export function reviewCounts() {
  const now = Date.now();
  const oneDay = 86400000;
  const all = Object.values(store.state.srs);
  return {
    dueToday: all.filter((i) => i.nextReview <= now).length,
    overdue: all.filter((i) => now - i.nextReview > oneDay).length,
    total: all.length,
    byType: all.reduce((acc, i) => {
      acc[i.type] = acc[i.type] || { total: 0, due: 0 };
      acc[i.type].total++;
      if (i.nextReview <= now) acc[i.type].due++;
      return acc;
    }, {})
  };
}

export const QUALITY = {
  AGAIN: 0,
  HARD_FAIL: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
  PERFECT: 5
};

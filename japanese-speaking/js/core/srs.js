// SM-2-inspired spaced repetition, the same family of algorithm Anki uses.
// Grades: "again" (didn't know it), "hard", "good", "easy". Interval is capped at 180 days —
// once something is that well-known, a light touch every ~6 months is enough to keep it fluent.
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const MAX_INTERVAL_DAYS = 180;
const DAY_MS = 86400000;

export function newRecord() {
  return { interval: 0, ease: 2.5, reps: 0, lapses: 0, due: 0, lastReviewed: 0 };
}

export function grade(record, gradeName) {
  const r = record ? { ...record } : newRecord();
  if (gradeName === "again") {
    r.lapses += 1;
    r.reps = 0;
    r.interval = 0;
    r.ease = Math.max(MIN_EASE, r.ease - 0.2);
  } else if (gradeName === "hard") {
    r.reps += 1;
    r.interval = Math.max(1, Math.round((r.interval || 1) * 1.2));
    r.ease = Math.max(MIN_EASE, r.ease - 0.15);
  } else if (gradeName === "good") {
    r.reps += 1;
    r.interval = r.reps === 1 ? 1 : Math.round(r.interval * r.ease);
    r.interval = Math.max(1, r.interval);
  } else if (gradeName === "easy") {
    r.reps += 1;
    r.interval = r.reps === 1 ? 4 : Math.round(r.interval * r.ease * 1.3);
    r.ease = Math.min(MAX_EASE, r.ease + 0.15);
  }
  r.interval = Math.min(r.interval, MAX_INTERVAL_DAYS);
  r.due = Date.now() + r.interval * DAY_MS;
  r.lastReviewed = Date.now();
  return r;
}

export function isDue(record) {
  return !!record && record.due <= Date.now();
}

export function isNew(record) {
  return !record;
}

export function stageLabel(record) {
  if (!record || record.reps === 0) return "new";
  if (record.interval < 7) return "learning";
  if (record.interval < 30) return "young";
  return "mastered";
}

export function formatInterval(days) {
  if (days <= 0) return "again soon";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  if (days < 60) return "1 month";
  if (days < 365) return `${Math.round(days / 30)} months`;
  return "6+ months";
}

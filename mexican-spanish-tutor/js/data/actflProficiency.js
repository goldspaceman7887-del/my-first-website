// THE 9-LEVEL ACTFL LADDER for the new adaptive proficiency engine
// (core/ratingEngine.js, core/rubricEngine.js, core/taskSelector.js).
//
// Deliberately separate from data/roadmap.js's 7-level ACTFL_LEVELS, which
// drives the Roadmap path (Novice Low - Advanced Low) and is out of scope
// for this phase. This ladder extends through Advanced High and exists only
// for the new per-skill proficiency tracking (Speaking in Phase 1; Writing/
// Reading/Listening reuse the same ladder in later phases).
//
// Rating bands are ~267 points apart on a 0-2400 scale, matching the
// redesign doc (docs/actfl-assessment-redesign.md, section 2.2).

export const PROFICIENCY_LEVELS = [
  { code: "novice-low", label: "Novice Low", short: "NL", ratingMin: 0,
    blurb: "Isolated words and memorized phrases." },
  { code: "novice-mid", label: "Novice Mid", short: "NM", ratingMin: 267,
    blurb: "Short lists and simple formulaic sentences on very familiar topics." },
  { code: "novice-high", label: "Novice High", short: "NH", ratingMin: 534,
    blurb: "Simple sentences on familiar topics, starting to create original language." },
  { code: "intermediate-low", label: "Intermediate Low", short: "IL", ratingMin: 801,
    blurb: "Creates with the language: original sentences on everyday needs." },
  { code: "intermediate-mid", label: "Intermediate Mid", short: "IM", ratingMin: 1067,
    blurb: "Sustains sentence-level discourse across everyday, familiar situations." },
  { code: "intermediate-high", label: "Intermediate High", short: "IH", ratingMin: 1334,
    blurb: "Connected paragraphs on personal topics; narrates, and can attempt a complication." },
  { code: "advanced-low", label: "Advanced Low", short: "AL", ratingMin: 1601,
    blurb: "Paragraph-length discourse in all major time frames; handles a complication." },
  { code: "advanced-mid", label: "Advanced Mid", short: "AM", ratingMin: 1867,
    blurb: "Full control across time frames; handles the unexpected with ease." },
  { code: "advanced-high", label: "Advanced High", short: "AH", ratingMin: 2134,
    blurb: "Sporadic command of Superior-level tasks: hypothesizing, structured argument." }
];

export function bandIndexForRating(rating) {
  let idx = 0;
  for (let i = 0; i < PROFICIENCY_LEVELS.length; i++) {
    if (rating >= PROFICIENCY_LEVELS[i].ratingMin) idx = i;
  }
  return idx;
}

export function levelAt(idx) {
  const i = Math.max(0, Math.min(PROFICIENCY_LEVELS.length - 1, idx));
  return PROFICIENCY_LEVELS[i];
}

// Center of a band's range, used as a task's default difficulty rating when
// a task doesn't specify its own jittered value.
export function bandCenter(idx) {
  const lvl = levelAt(idx);
  const next = PROFICIENCY_LEVELS[idx + 1];
  const span = next ? next.ratingMin - lvl.ratingMin : 267;
  return lvl.ratingMin + Math.round(span / 2);
}
